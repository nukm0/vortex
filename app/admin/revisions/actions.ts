"use server";

import { revalidatePath } from "next/cache";
import { store, uid } from "@/lib/mock-data";

export async function createRevision(formData: FormData) {
  const sellerId = formData.get("sellerId") as string;
  const note = (formData.get("note") as string) || null;
  if (!sellerId) return;

  const sItems = store.items.filter((i) => i.sellerId === sellerId);
  if (sItems.length === 0) return;

  store.revisions.unshift({
    id: uid("r"),
    sellerId,
    note,
    createdAt: new Date().toISOString(),
    items: sItems.map((it) => ({
      itemId: it.id,
      expected: it.quantity,
      actual: it.quantity,
    })),
  });

  revalidatePath("/admin/revisions");
}

export async function applyRevision(formData: FormData) {
  const id = formData.get("id") as string;
  const revision = store.revisions.find((r) => r.id === id);
  if (!revision) return;

  for (const ri of revision.items) {
    const item = store.items.find((i) => i.id === ri.itemId);
    if (item) item.quantity = ri.actual;
  }

  revalidatePath("/admin/revisions");
  revalidatePath("/admin/items");
  revalidatePath("/admin/balance");
}
