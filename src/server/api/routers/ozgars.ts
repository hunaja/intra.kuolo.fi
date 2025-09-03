import { db } from "@/server/db";
import {
  adminProtectedProcedure,
  createTRPCRouter,
  notAdvertiserProcedure,
} from "../trpc";
import { z } from "zod";
import { zfd } from "zod-form-data";
import sharp from "sharp";
import minio from "@/server/minio";

const LIMIT = 4;

export const ozgarsRouter = createTRPCRouter({
  uploadVideo: adminProtectedProcedure
    .input(
      zfd.formData({
        year: zfd.numeric(),
        name: zfd.text(),
        thumbnail: zfd.file(),
      }),
    )
    .mutation(async ({ input }) => {
      const resizedImage = await sharp(await input.thumbnail.arrayBuffer())
        .resize(200, 300, {
          fit: sharp.fit.fill,
          position: sharp.strategy.entropy,
        })
        .toFormat("jpeg")
        .toBuffer();

      let year = await db.ozgarYear.findUnique({ where: { year: input.year } });
      if (!year) {
        year = await db.ozgarYear.create({
          data: {
            year: input.year,
          },
        });
      }

      const video = await db.ozgarVideo.create({
        data: {
          yearId: year.id,
          name: input.name,
        },
      });

      const thumbnailLocation = `${video.id}.jpeg`;

      const { uploadOzgarsThumbnail } = await minio();
      await uploadOzgarsThumbnail(thumbnailLocation, resizedImage);

      video.thumbnailLocation = thumbnailLocation;
      return video;
    }),
  getYears: notAdvertiserProcedure
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
        years: years.map((year) => ({
          id: year.id,
          year: year.year,
        })),
        nextCursor,
      };
    }),
});
