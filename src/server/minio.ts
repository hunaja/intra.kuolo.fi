import { env } from "@/env";
import * as Minio from "minio";

let cachedClient: Minio.Client | null = null;

export const bucketPrefix = "rg-";

const PRESIGNED_URL_EXPIRATION = 24 * 60 * 60;

const clientActions = (client: Minio.Client) => ({
  getUploadExamUrl: async (filename: string) => {
    return await client.presignedPutObject(
      `${bucketPrefix}exams`,
      filename,
      PRESIGNED_URL_EXPIRATION,
    );
  },
  getDownloadExamUrl: async (filename: string) => {
    return await client.presignedGetObject(
      `${bucketPrefix}exams`,
      filename,
      PRESIGNED_URL_EXPIRATION,
      {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    );
  },
  deleteExamFile: async (filename: string) => {
    return await client.removeObject(`${bucketPrefix}exams`, filename);
  },
});

export default async function minio() {
  if (cachedClient) {
    return clientActions(cachedClient);
  }

  try {
    const client = new Minio.Client({
      endPoint: env.MINIO_ENDPOINT,
      port: env.MINIO_PORT,
      useSSL: env.MINIO_USE_SSL,
      accessKey: env.MINIO_ACCESS_KEY,
      secretKey: env.MINIO_SECRET_KEY,
    });

    if (!(await client.bucketExists(bucketPrefix + "exams"))) {
      await client.makeBucket(bucketPrefix + "exams");
    }

    await client.setBucketPolicy(
      bucketPrefix + "exams",
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucketPrefix}exams/*`],
          },
        ],
      }),
    );

    cachedClient = client;

    return clientActions(client);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
