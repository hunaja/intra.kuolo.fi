import { parse } from "csv";
import { readFile } from "fs/promises";
import dotenv from "dotenv";
import { db } from "../src/server/db";
import type { MemberClassYear } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

dotenv.config({
  path: __dirname + "/./../.env.local",
});

const parseFile = async (path: string) => {
  return new Promise<string[][]>((resolve, reject) => {
    readFile(path)
      .then((data) => {
        parse(
          data,
          {
            delimiter: ";",
            encoding: "utf8",
          },
          (err: unknown, records: string[][]) => {
            if (err instanceof Error) reject(err);
            else resolve(records);
          },
        );
      })
      .catch(reject);
  });
};

const importMembers = async () => {
  const records = await parseFile(__dirname + "/./../registry.csv");
  const loopedUsers = new Set<string>();

  for (const userRecord of records) {
    const [
      ,
      ,
      ,
      ,
      ,
      ,
      validUntil,
      ,
      ,
      ,
      ,
      lastName,
      callName,
      email,
      ,
      ,
      ,
      ,
      phoneNumber,
      ,
      classYear,
      ,
      ,
      ,
      disclosedInfo,
    ] = userRecord;
    if (new Date(validUntil) < new Date()) continue;

    const visible = disclosedInfo.includes("Nimi");
    const phoneNumberVisible = disclosedInfo.includes("puhelinnumero");
    const fullName = `${callName} ${lastName}`;

    loopedUsers.add(email);

    const userExists = await db.member.findUnique({
      where: {
        email,
      },
    });
    if (userExists) {
      await db.member.update({
        data: {
          fullName,
          classYear: classYear as MemberClassYear,
          phone: `+${phoneNumber}`,
          hiddenFromList: !visible,
          phoneHiddenFromList: !phoneNumberVisible,
        },
        where: {
          email,
        },
      });
    } else {
      await db.member.create({
        data: {
          fullName,
          classYear: classYear as MemberClassYear,
          email,
          phone: `+${phoneNumber}`,
          hiddenFromList: !visible,
          phoneHiddenFromList: !phoneNumberVisible,
        },
      });
    }
  }

  const allMembers = await db.member.findMany();

  // Delete members that are not in the registry
  for (const member of allMembers) {
    if (!loopedUsers.has(member.email)) {
      await db.exam.updateMany({
        where: {
          submitterId: member.id,
        },
        data: {
          submitterId: null,
        },
      });

      await db.member.delete({
        where: {
          id: member.id,
        },
      });
    }
  }
};

void importMembers();
