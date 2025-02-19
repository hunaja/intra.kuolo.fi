import { z } from "zod";
import { db } from "../src/server/db";
import crypto from "crypto";

const setAdminScript = async (email: string) => {
  const member = await db.member.findUnique({
    where: { email },
  });

  if (!member) return console.error("Member not found");

  try {
    await db.memberInvitation.delete({
      where: {
        memberId: member.id,
      },
    });
  } catch (ignored) {}

  const newInvitation = await db.memberInvitation.create({
    data: {
      memberId: member.id,
      token: crypto.randomBytes(32).toString("hex"),
    },
  });

  console.log(newInvitation);
};

void setAdminScript(process.argv[2]);
