import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

const LIMIT = 4;

export const ozgarsRouter = createTRPCRouter({
  getYears: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { cursor } = input;

      const years = await db.ozgarYear.findMany({
        where: {
          year: {
            lt: cursor,
          },
        },
        orderBy: {
          year: "desc",
        },
        include: {
          videos: {
            take: 1,
          },
        },
        take: LIMIT,
      });
      const nextCursor =
        years.length === LIMIT + 1
          ? (years[years.length - 2]?.year ?? null)
          : null;
      if (nextCursor) {
        years.pop();
      }

      return {
        nextCursor,
      };
    }),
});
