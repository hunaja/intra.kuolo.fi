import { db } from "../src/server/db";

const deleteAccountScript = async (email: string) => {
  const member = await db.member.findUnique({
    where: { email },
  });

  if (!member) return console.error("Member not found");

  try {
    await db.account.delete({
      where: {
        email,
      },
    });
  } catch (ignored) {}

  console.log("Member", email, "account deleted");
};

void deleteAccountScript(process.argv[2]);
