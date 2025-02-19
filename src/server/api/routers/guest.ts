import { db } from "@/server/db";
import { adminProtectedProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

const HASH_ROUNDS = 10;

export const guestRouter = createTRPCRouter({
  getAll: adminProtectedProcedure.query(async () => {
    return db.guest.findMany();
  }),
  createGuest: adminProtectedProcedure
    .input(
      z.object({
        fullName: z.string(),
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input: data }) => {
      db.guest.create({ data });

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
  deleteGuest: adminProtectedProcedure
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
