import { z } from "zod";

import {
  adminProtectedProcedure,
  createTRPCRouter,
  memberProtectedProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import mime from "mime-types";
import minio from "@/server/minio";
import { TRPCError } from "@trpc/server";

export const examRouter = createTRPCRouter({
  getAllInvisible: adminProtectedProcedure.query(async () => {
    return await db.exam.findMany({
      where: {
        hiddenFromList: true,
      },
      include: {
        course: true,
        submitter: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  deleteExam: adminProtectedProcedure
    .input(z.string().nonempty())
    .mutation(async ({ input }) => {
      const exam = await db.exam.delete({
        where: {
          id: input,
        },
      });

      if (exam.fileName) {
        const { deleteExamFile } = await minio();
        await deleteExamFile(exam.fileName);
      }
    }),
  approveExam: adminProtectedProcedure
    .input(z.string().nonempty())
    .mutation(async ({ input }) => {
      return await db.exam.update({
        where: {
          id: input,
        },
        data: {
          hiddenFromList: false,
        },
      });
    }),
  submitExam: memberProtectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        year: z.number().nullable(),
        name: z.string().max(25),
        file: z.object({
          name: z.string(),
          size: z.number(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const course = await db.course.findUnique({
        where: {
          id: input.courseId,
        },
      });
      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      const fileMimeType = mime.contentType(input.file.name);
      if (!fileMimeType) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid file type",
        });
      }
      const fileExtension = mime.extension(fileMimeType);

      const exam = await db.exam.create({
        data: {
          course: {
            connect: {
              id: input.courseId,
            },
          },
          year: input.year,
          name: input.name,
          hiddenFromList: !ctx.session.admin,
          fileMimeType,
          fileSize: input.file.size,
          submitter: {
            connect: {
              id: ctx.session.id,
            },
          },
        },
      });

      const fileName = `${exam.id}.${fileExtension}`;

      await db.exam.update({
        where: {
          id: exam.id,
        },
        data: {
          fileName,
        },
      });

      const { getUploadExamUrl } = await minio();
      return await getUploadExamUrl(fileName);
    }),
  getDownloadUrl: protectedProcedure
    .input(
      z.object({
        examId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const {
        input: { examId },
      } = opts;

      const exam = await db.exam.findUnique({
        where: {
          id: examId,
        },
      });

      if (!exam?.fileName) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      const { getDownloadExamUrl } = await minio();
      return await getDownloadExamUrl(exam.fileName);
    }),
});
