import { db } from "../src/server/db";

const addGuest = async (email: string, fullName: string) => {
  const guest = await db.guest.create({
    data: {
      email,
      fullName,
    },
  });

  console.log(`Added user ${email} --> "${fullName}", id ${guest.id}`);
};

const [, , email, ...fullNameParts] = process.argv;
const fullName = fullNameParts.join(" ");

void addGuest(email, fullName);
