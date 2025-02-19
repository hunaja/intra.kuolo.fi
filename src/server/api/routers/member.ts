import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  memberProtectedProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import type { Prisma } from "@prisma/client";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";

const LIMIT = 10;

export const memberRouter = createTRPCRouter({
  getSelf: memberProtectedProcedure.query(async ({ ctx }) => {
    return db.member.findUnique({
      where: {
        id: ctx.session.id,
      },
    });
  }),
  getStudents: protectedProcedure
    .input(
      z.object({
        fullNameSearch: z.string().optional(),
        courses: z
          .array(z.enum(["LT1", "LT2", "LT3", "LT4", "LT5", "LT6", "LTn"]))
          .default(["LT1", "LT2", "LT3", "LT4", "LT5", "LT6", "LTn"]),
        cursor: z.string().optional(),
      }),
    )
    .query(async (opts) => {
      const {
        input: { fullNameSearch, cursor, courses },
      } = opts;

      const where: Prisma.MemberWhereInput = {
        hiddenFromList: false,
        classYear: {
          in: courses,
          not: "alumni",
        },
      };

      if (fullNameSearch) {
        where.fullName = {
          search: fullNameSearch.trim().replaceAll(" ", "&"),
        };
      }

      if (cursor) {
        where.fullName = {
          gt: cursor,
        };
      }

      const members = await db.member.findMany({
        where,
        orderBy: {
          fullName: "asc",
        },
        take: LIMIT + 1,
      });

      const nextCursor =
        members.length === LIMIT + 1
          ? (members[members.length - 2]?.fullName ?? null)
          : null;
      if (nextCursor) {
        members.pop();
      }

      return {
        data: members.map((m) => {
          return {
            id: m.id,
            fullName: m.fullName,
            classYear: m.classYear,
            email: m.email,
            phone: !m.phoneHiddenFromList ? m.phone : null,
            phoneHiddenFromList: m.phoneHiddenFromList,
          };
        }),
        nextCursor: nextCursor,
      };
    }),
  toggleHiddenFromList: memberProtectedProcedure.mutation(async ({ ctx }) => {
    const id = ctx.session.id;

    const member = await db.member.findUnique({
      where: { id },
    });

    if (!member) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Member not found",
      });
    }

    return db.member.update({
      where: { id },
      data: {
        hiddenFromList: !member.hiddenFromList,
      },
    });
  }),
  togglePhoneHiddenFromList: memberProtectedProcedure.mutation(
    async ({ ctx }) => {
      const id = ctx.session.id;

      const member = await db.member.findUnique({
        where: { id },
      });

      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found",
        });
      }

      return db.member.update({
        where: { id },
        data: {
          phoneHiddenFromList: !member.phoneHiddenFromList,
        },
      });
    },
  ),
  replaceStudents: adminProtectedProcedure
    .input(
      z.array(
        z.object({
          lastName: z.string(),
          callName: z.string(),
          email: z.string().email(),
          classYear: z.enum(["LT1", "LT2", "LT3", "LT4", "LT5", "LT6", "LTn"]),
          phone: z.string(),
          disclosedInfo: z.string(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      const loopedUsers = new Set<string>();

      for (const userRecord of input) {
        const { lastName, callName, email, classYear, phone, disclosedInfo } =
          userRecord;

        loopedUsers.add(email);

        const hiddenFromList = !disclosedInfo.includes("Nimi");
        const phoneHiddenFromList = !disclosedInfo.includes("puhelinnumero");
        const fullName = `${callName} ${lastName}`;

        const data = {
          fullName,
          classYear,
          hiddenFromList,
          phoneHiddenFromList,
          phone: `+${phone}`,
        };

        const userExists = await db.member.findUnique({ where: { email } });
        if (userExists) {
          await db.member.update({
            data,
            where: {
              email,
            },
          });
        } else {
          await db.member.create({
            data: {
              ...data,
              email,
            },
          });
        }
      }

      await db.member.deleteMany({
        where: {
          NOT: {
            email: {
              in: [...loopedUsers],
            },
          },
        },
      });
    }),
});
