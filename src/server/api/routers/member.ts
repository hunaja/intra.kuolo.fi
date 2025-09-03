import { z } from "zod";

import crypto from "crypto";
import {
  adminProtectedProcedure,
  createTRPCRouter,
  memberProtectedProcedure,
  permissionProtectedProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { Permission, type Prisma, type Member } from "@prisma/client";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { sendEmail } from "@/server/email";

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
  getMemberByEmail: adminProtectedProcedure
    .input(z.string())
    .query(async ({ input: email }) => {
      return db.member.findUnique({
        where: {
          email,
        },
      });
    }),
  getPermittedMembers: adminProtectedProcedure.query(async () => {
    return db.member.findMany({
      where: {
        permissions: { isEmpty: false },
      },
    });
  }),
  togglePermission: adminProtectedProcedure
    .input(
      z.object({
        id: z.string(),
        permission: z.enum(["EDIT_EXAMS", "EDIT_MEMBERS", "EDIT_GUESTS"]),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await db.member.findUnique({ where: { id: input.id } });

      if (!user)
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });

      if (user.permissions.includes(input.permission)) {
        return db.member.update({
          where: {
            id: input.id,
          },
          data: {
            permissions: user.permissions.filter((p) => p !== input.permission),
          },
        });
      }

      return db.member.update({
        where: {
          id: input.id,
        },
        data: {
          permissions: {
            push: input.permission,
          },
        },
      });
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
  replaceAlumnis: permissionProtectedProcedure
    .meta({
      requiredPermission: Permission.EDIT_MEMBERS,
    })
    .input(
      z.array(
        z.object({
          lastName: z.string(),
          firstName: z.string(),
          email: z.string(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      const loopedAlumnis = new Set<string>();

      for (const alumniRecord of input) {
        const { lastName, firstName, email } = alumniRecord;

        loopedAlumnis.add(email);

        let member = await db.member.findUnique({
          where: { email },
        });
        if (!member) {
          member = await db.member.create({
            data: {
              fullName: `${firstName} ${lastName}`,
              email,
              classYear: "alumni",
            },
          });
        }

        const account = await db.account.findUnique({
          where: { email },
        });

        // If there is no account and the user is not invited, the user should be invited.
        if (!account) {
          const invitation = await db.memberInvitation.findUnique({
            where: { memberId: member.id },
          });

          if (!invitation) {
            const newInvitation = await db.memberInvitation.create({
              data: {
                memberId: member.id,
                token: crypto.randomBytes(32).toString("hex"),
              },
            });

            await sendEmail({
              to: email,
              subject: "Kutsu KuoLO Ry:n jäsensivuille",
              text: `Sinut on kutsuttu luomaan tili KuoLO Ry:n jäsensivuille.\n
Voit käyttää tätä linkkiä: https://intra.kuolo.fi/sign-up?token=${newInvitation.token}`,
            });
          }
        }
      }

      const students = await db.member.findMany({
        where: {
          NOT: {
            classYear: "alumni",
          },
        },
      });
      const studentEmails = students.map((m) => m.email);

      const guests = await db.guest.findMany();
      const guestEmails = guests.map((g) => g.email);

      // Remove all alumnis that are not in the member registry
      await db.member.deleteMany({
        where: {
          NOT: {
            email: {
              in: [...loopedAlumnis, ...studentEmails],
            },
          },
        },
      });

      // Remove all alumnis that are not in the alumni registry
      await db.account.deleteMany({
        where: {
          NOT: {
            email: {
              in: [...loopedAlumnis, ...guestEmails, ...studentEmails],
            },
          },
        },
      });
    }),
  replaceStudents: permissionProtectedProcedure
    .meta({
      requiredPermission: Permission.EDIT_MEMBERS,
    })
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

        let member: Member;
        if (userExists) {
          member = await db.member.update({
            data,
            where: {
              email,
            },
          });
        } else {
          member = await db.member.create({
            data: {
              ...data,
              email,
            },
          });
        }

        const account = await db.account.findUnique({
          where: { email },
        });

        // If there is no account and the user is not invited, the user should be invited.
        if (!account) {
          const invitation = await db.memberInvitation.findUnique({
            where: { memberId: member.id },
          });

          if (!invitation) {
            const newInvitation = await db.memberInvitation.create({
              data: {
                memberId: member.id,
                token: crypto.randomBytes(32).toString("hex"),
              },
            });

            await sendEmail({
              to: email,
              subject: "Kutsu KuoLO Ry:n jäsensivuille",
              text: `Sinut on kutsuttu luomaan tili KuoLO Ry:n jäsensivuille.\n
Voit käyttää tätä linkkiä: https://intra.kuolo.fi/sign-up?token=${newInvitation.token}`,
            });
          }
        }
      }

      const guests = await db.guest.findMany();
      const guestEmails = guests.map((g) => g.email);

      const alumnis = await db.member.findMany({
        where: {
          classYear: "alumni",
        },
      });
      const alumniEmails = alumnis.map((a) => a.email);

      // Remove all students that are not in the member registry
      await db.member.deleteMany({
        where: {
          NOT: {
            email: {
              in: [...loopedUsers, ...alumniEmails],
            },
          },
        },
      });

      // Remove all the student accounts (non-guest and non-alumn) that are not in the member registry
      await db.account.deleteMany({
        where: {
          NOT: {
            email: {
              in: [...loopedUsers, ...guestEmails, ...alumniEmails],
            },
          },
        },
      });
    }),
});
