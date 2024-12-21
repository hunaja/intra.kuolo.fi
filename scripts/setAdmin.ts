import { z } from "zod";
import { db } from "../src/server/db";

const setAdminScript = async (email: string, admin: boolean) => {
  const updated = await db.member.update({
    where: { email },
    data: {
      admin,
    },
  });

  console.log(`Set admin status of member ${email} to ${updated.admin}`);
};

void setAdminScript(process.argv[2], process.argv[3] === "true");
