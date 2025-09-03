import { db } from "@/server/db";
import { createTRPCRouter, permissionProtectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { Permission } from "@prisma/client";

const HASH_ROUNDS = 10;

export const guestRouter = createTRPCRouter({
  getAll: permissionProtectedProcedure
    .meta({
      requiredPermission: Permission.EDIT_GUESTS,
    })
    .query(async () => {
      return db.guest.findMany();
    }),
  createGuest: permissionProtectedProcedure
    .meta({
      requiredPermission: Permission.EDIT_GUESTS,
    })
    .input(
      z.object({
        fullName: z.string(),
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input: data }) => {
      await db.guest.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          advertiser: true,
        },
      });

      const possibleAccount = await db.account.findUnique({
        where: { email: data.email },
      });
      if (possibleAccount) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Account already exists",
        });
      }

      await db.account.create({
        data: {
          email: data.email,
          password: await bcrypt.hash(data.password, HASH_ROUNDS),
        },
      });
    }),
  deleteGuest: permissionProtectedProcedure
    .meta({
      requiredPermission: Permission.EDIT_GUESTS,
    })
    .input(z.string())
    .mutation(async ({ input: id }) => {
      const guest = await db.guest.delete({
        where: { id },
      });

      await db.account.delete({
        where: { email: guest.email },
      });
    }),
});
