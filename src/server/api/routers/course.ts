import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";

export const courseRouter = createTRPCRouter({
  getCoursesForClassYear: protectedProcedure
    .input(z.enum(["LT1", "LT2", "LT3", "LT4", "LT5", "LT6"]))
    .query(async ({ input: classYear }) => {
      return await db.course.findMany({
        where: {
          classYear: {
            equals: classYear,
          },
        },
        include: {
          exams: {
            where: {
              hiddenFromList: false,
            },
          },
        },
      });
    }),
  createCourse: adminProtectedProcedure
    .input(
      z.object({
        name: z.string().max(25),
        classYear: z.enum(["LT1", "LT2", "LT3", "LT4", "LT5", "LT6"]),
        code: z.string().max(10),
      }),
    )
    .mutation(async ({ input }) => {
      return await db.course.create({
        data: {
          name: input.name,
          classYear: input.classYear,
          code: input.code,
        },
      });
    }),
});
