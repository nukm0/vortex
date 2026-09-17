import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Владелец
  const hashed = await bcrypt.hash("owner", 10);
  await prisma.user.upsert({
    where: { login: "owner" },
    update: {},
    create: { login: "owner", password: hashed, role: "owner" },
  });

  // Города
  const cities = ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург"];
  for (const name of cities) {
    await prisma.city.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("✅ Seed completed. Login: owner / owner");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
