"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const CATEGORIES = ["electronics", "clothing", "food", "general"] as const;

export async function createSeller(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const username = (formData.get("username") as string)?.trim() || null;
  const cityId = formData.get("cityId") as string;

  if (!name || !cityId) throw new Error("Имя и город обязательны");

  const ratesJson: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    const v = formData.get(`rate_${cat}`);
    if (v && v !== "") ratesJson[cat] = Number(v);
  }

  await prisma.seller.create({
    data: { name, phone, username, cityId, ratesJson },
  });

  revalidatePath("/admin/sellers");
}

export async function deleteSeller(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  // Отвяжем товары, чтобы не падало по FK
  await prisma.item.updateMany({ where: { sellerId: id }, data: { sellerId: null } });
  await prisma.seller.delete({ where: { id } });
  revalidatePath("/admin/sellers");
}
