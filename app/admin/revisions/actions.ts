"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRevision(formData: FormData) {
  const sellerId = formData.get("sellerId") as string;
  const note = (formData.get("note") as string) || null;
  if (!sellerId) throw new Error("Выберите продавца");

  const items = await prisma.item.findMany({ where: { sellerId } });
  if (items.length === 0) {
    throw new Error("У продавца нет товаров");
  }

  await prisma.revision.create({
    data: {
      sellerId,
      note,
      items: {
        create: items.map((it) => ({
          itemId: it.id,
          expected: it.quantity,
          actual: Number(formData.get(`actual_${it.id}`) ?? it.quantity),
        })),
      },
    },
  });

  revalidatePath("/admin/revisions");
}

export async function applyRevision(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const revision = await prisma.revision.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!revision) return;

  for (const ri of revision.items) {
    await prisma.item.update({
      where: { id: ri.itemId },
      data: { quantity: ri.actual },
    });
  }

  revalidatePath("/admin/revisions");
  revalidatePath("/admin/items");
}
