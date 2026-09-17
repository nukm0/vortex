"use server";

import { revalidatePath } from "next/cache";
import { store, uid } from "@/lib/mock-data";

export async function createCategory(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;

  // Не создаём дубли
  if (store.categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    return;
  }

  store.categories.push({
    id: uid("cat"),
    name,
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/sellers");
  revalidatePath("/admin/items");
}

export async function deleteCategory(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  // Отвязываем товары и убираем ставки у продавцов
  store.items = store.items.filter((i) => i.categoryId !== id);
  for (const seller of store.sellers) {
    delete seller.rates[id];
  }
  store.categories = store.categories.filter((c) => c.id !== id);

  revalidatePath("/admin/categories");
  revalidatePath("/admin/sellers");
  revalidatePath("/admin/items");
  revalidatePath("/admin/balance");
}
