"use server";

import { revalidatePath } from "next/cache";
import { store, uid } from "@/lib/mock-data";

export async function createSeller(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const username = (formData.get("username") as string)?.trim() || null;
  const cityId = formData.get("cityId") as string;

  if (!name || !cityId) return;

  // Ставки — только для существующих категорий
  const rates: Record<string, number> = {};
  for (const cat of store.categories) {
    const v = formData.get(`rate_${cat.id}`);
    if (v !== null && v !== "") rates[cat.id] = Number(v);
  }

  store.sellers.unshift({
    id: uid("s"),
    name,
    phone,
    username,
    cityId,
    rates,
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/admin/sellers");
}

export async function updateSeller(formData: FormData) {
  const id = formData.get("id") as string;
  const seller = store.sellers.find((s) => s.id === id);
  if (!seller) return;

  seller.name = (formData.get("name") as string)?.trim() || seller.name;
  seller.phone = (formData.get("phone") as string)?.trim() || null;
  seller.username = (formData.get("username") as string)?.trim() || null;

  const rates: Record<string, number> = {};
  for (const cat of store.categories) {
    const v = formData.get(`rate_${cat.id}`);
    if (v !== null && v !== "") rates[cat.id] = Number(v);
  }
  seller.rates = rates;

  revalidatePath("/admin/sellers");
  revalidatePath("/admin/balance");
}

export async function deleteSeller(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  store.items = store.items.map((i) =>
    i.sellerId === id ? { ...i, sellerId: null } : i
  );
  store.sellers = store.sellers.filter((s) => s.id !== id);

  revalidatePath("/admin/sellers");
  revalidatePath("/admin/balance");
  revalidatePath("/admin/items");
}
