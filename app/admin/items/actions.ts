"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createItem(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const price = Number(formData.get("price"));
  const cityId = formData.get("cityId") as string;
  const sellerIdRaw = formData.get("sellerId") as string;
  const sellerId = sellerIdRaw && sellerIdRaw !== "none" ? sellerIdRaw : null;
  const adminRateRaw = formData.get("adminRate") as string;
  const adminRate =
    !adminRateRaw || adminRateRaw === "none" ? null : Number(adminRateRaw);
  const quantity = Number(formData.get("quantity")) || 1;
  const category = (formData.get("category") as string) || "general";

  if (!name || !cityId || !price) throw new Error("Заполните обязательные поля");

  await prisma.item.create({
    data: {
      name,
      price,
      cityId,
      sellerId,
      adminRate,
      quantity,
      category,
    },
  });

  revalidatePath("/admin/items");
}

export async function deleteItem(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.item.delete({ where: { id } });
  revalidatePath("/admin/items");
}

export async function updateItem(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const quantity = Number(formData.get("quantity"));
  const adminRateRaw = formData.get("adminRate") as string;
  const adminRate =
    !adminRateRaw || adminRateRaw === "none" ? null : Number(adminRateRaw);
  const sellerIdRaw = formData.get("sellerId") as string;
  const sellerId = sellerIdRaw && sellerIdRaw !== "none" ? sellerIdRaw : null;

  if (!id) return;

  await prisma.item.update({
    where: { id },
    data: { name, price, quantity, adminRate, sellerId },
  });

  revalidatePath("/admin/items");
}
