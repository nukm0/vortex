"use server";

import { revalidatePath } from "next/cache";
import { store, uid } from "@/lib/mock-data";

const CATEGORIES = ["electronics", "clothing", "food", "general"];

export async function createSeller(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const username = (formData.get("username") as string)?.trim() || null;
  const cityId = formData.get("cityId") as string;

  if (!name || !cityId) return;

  const rates: Record<string, number> = {};
  for (const cat of CATEGORIES) {
    const v = formData.get(`rate_${cat}`);
    if (v && v !== "") rates[cat] = Number(v);
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

export async function deleteSeller(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  store.items = store.items.map((i) =>
    i.sellerId === id ? { ...i, sellerId: null } : i
  );
  store.sellers = store.sellers.filter((s) => s.id !== id);

  revalidatePath("/admin/sellers");
}
