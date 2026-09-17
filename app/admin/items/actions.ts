"use server";

import { revalidatePath } from "next/cache";
import { store, uid } from "@/lib/mock-data";

export async function createItem(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const price = Number(formData.get("price"));
  const cityId = formData.get("cityId") as string;
  const categoryId = formData.get("categoryId") as string;
  const sellerRaw = formData.get("sellerId") as string;
  const sellerId = sellerRaw && sellerRaw !== "none" ? sellerRaw : null;
  const adminRateRaw = formData.get("adminRate") as string;
  const adminRate =
    !adminRateRaw || adminRateRaw === "none" ? null : Number(adminRateRaw);
  const quantity = Number(formData.get("quantity")) || 1;

  if (!name || !cityId || !categoryId || !price) return;

  store.items.unshift({
    id: uid("i"),
    name,
    price,
    quantity,
    categoryId,
    cityId,
    sellerId,
    adminRate,
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/admin/items");
  revalidatePath("/admin/balance");
}

export async function updateItem(formData: FormData) {
  const id = formData.get("id") as string;
  const item = store.items.find((i) => i.id === id);
  if (!item) return;

  item.name = (formData.get("name") as string)?.trim() || item.name;
  item.price = Number(formData.get("price")) || item.price;
  item.quantity = Number(formData.get("quantity")) || item.quantity;
  item.categoryId = (formData.get("categoryId") as string) || item.categoryId;

  const adminRateRaw = formData.get("adminRate") as string;
  item.adminRate =
    !adminRateRaw || adminRateRaw === "none" ? null : Number(adminRateRaw);

  const sellerRaw = formData.get("sellerId") as string;
  item.sellerId = sellerRaw && sellerRaw !== "none" ? sellerRaw : null;

  revalidatePath("/admin/items");
  revalidatePath("/admin/balance");
}

export async function deleteItem(formData: FormData) {
  const id = formData.get("id") as string;
  store.items = store.items.filter((i) => i.id !== id);
  revalidatePath("/admin/items");
  revalidatePath("/admin/balance");
}
