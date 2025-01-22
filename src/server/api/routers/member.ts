import { z } from "zod";

import {
  createTRPCRouter,
  inauthedProcedure,
  memberProtectedProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import type { Prisma } from "@prisma/client";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { createClerkClient } from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { env } from "@/env";

const LIMIT = 10;

export const memberRouter = createTRPCRouter({
  getSelf: memberProtectedProcedure.query(async ({ ctx }) => {
    return db.member.findUnique({
      where: {
        id: ctx.session.id,
      },
    });
  }),
  createInvitation: inauthedProcedure
    .input(z.string().email())
    .mutation(async ({ input }) => {
      const member = await db.member.findUnique({
        where: {
          email: input,
        },
      });
      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found",
        });
      }

      const clerkClient = createClerkClient({
        secretKey: env.CLERK_SECRET_KEY,
      });

      try {
        const response = await clerkClient.invitations.createInvitation({
          emailAddress: input,
        });

        console.log(response);
      } catch (e) {
        if (!isClerkAPIResponseError(e)) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Unknown error while creating",
          });
        }

        if (e.errors.find((error) => error.code === "form_identifier_exists")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Member account already exists",
          });
        } else if (
          e.errors.find((error) => error.code === "duplicate_record")
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Invitation already sent",
          });
        }
      }
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
});
