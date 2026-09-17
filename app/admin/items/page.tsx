import { prisma } from "@/lib/prisma";
import { createItem, deleteItem, updateItem } from "./actions";

export default async function ItemsPage() {
  const [items, cities, sellers] = await Promise.all([
    prisma.item.findMany({
      include: { city: true, seller: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.seller.findMany({ include: { city: true }, orderBy: { name: "asc" } }),
  ]);

  // Общая статистика
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalValue = items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );

  // Персонал
  const bySeller = new Map<
    string,
    { name: string; city: string; items: typeof items; totalQty: number; totalValue: number }
  >();
  for (const it of items) {
    if (!it.seller) continue;
    const key = it.seller.id;
    if (!bySeller.has(key)) {
      bySeller.set(key, {
        name: it.seller.name,
        city: it.seller.city.name,
        items: [],
        totalQty: 0,
        totalValue: 0,
      });
    }
    const bucket = bySeller.get(key)!;
    bucket.items.push(it);
    bucket.totalQty += it.quantity;
    bucket.totalValue += Number(it.price) * it.quantity;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Товары</h1>

      {/* 1. Общая статистика */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">📊 Общее количество</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Всего товара</p>
            <p className="text-3xl font-bold">{totalQuantity} шт.</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">Сумма прибыли после продажи всего</p>
            <p className="text-3xl font-bold">
              {totalValue.toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>
      </section>

      {/* 2. Персонал */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">👥 Товары у персонала</h2>
        {bySeller.size === 0 && (
          <p className="text-gray-500">Товары пока никому не назначены</p>
        )}
        <div className="space-y-4">
          {[...bySeller.entries()].map(([id, s]) => (
            <div key={id} className="border rounded p-4">
              <div className="flex justify-between">
                <h3 className="font-medium">
                  {s.name} <span className="text-gray-500">({s.city})</span>
                </h3>
                <div className="text-sm text-gray-600">
                  {s.totalQty} шт. · {s.totalValue.toLocaleString("ru-RU")} ₽
                </div>
              </div>
              <ul className="mt-2 text-sm space-y-1">
                {s.items.map((it) => (
                  <li key={it.id}>
                    • {it.name} — {it.quantity} шт. × {Number(it.price)} ₽
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Добавить товар */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">➕ Добавить карточку товара</h2>
        <form action={createItem} className="grid grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Название"
            required
            className="border p-2 rounded"
          />
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Цена"
            required
            className="border p-2 rounded"
          />

          <select name="cityId" required className="border p-2 rounded">
            <option value="">Город</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select name="category" className="border p-2 rounded" defaultValue="general">
            <option value="electronics">Электроника</option>
            <option value="clothing">Одежда</option>
            <option value="food">Еда</option>
            <option value="general">Общая</option>
          </select>

          <select name="sellerId" className="border p-2 rounded" defaultValue="none">
            <option value="none">Без продавца (на складе)</option>
            {sellers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.city.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              name="adminRate"
              type="number"
              step="0.01"
              placeholder="Ставка админа"
              className="border p-2 rounded flex-1"
            />
            <span className="text-xs text-gray-500">
              (пусто = ставка продавца)
            </span>
          </div>

          <input
            name="quantity"
            type="number"
            defaultValue={1}
            min={1}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded col-span-2 hover:bg-blue-700"
          >
            Создать товар
          </button>
        </form>
      </section>

      {/* Список товаров с редактированием */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">📋 Все товары</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">Название</th>
                <th className="p-2">Цена</th>
                <th className="p-2">Кол-во</th>
                <th className="p-2">Город</th>
                <th className="p-2">Продавец</th>
                <th className="p-2">Ставка админа</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="p-2">
                    <form
                      action={updateItem}
                      id={`upd-${it.id}`}
                      className="contents"
                    >
                      <input type="hidden" name="id" value={it.id} />
                      <input
                        name="name"
                        defaultValue={it.name}
                        className="border p-1 rounded w-full"
                      />
                    </form>
                  </td>
                  <td className="p-2">
                    <input
                      form={`upd-${it.id}`}
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={Number(it.price)}
                      className="border p-1 rounded w-24"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      form={`upd-${it.id}`}
                      name="quantity"
                      type="number"
                      defaultValue={it.quantity}
                      className="border p-1 rounded w-20"
                    />
                  </td>
                  <td className="p-2">{it.city.name}</td>
                  <td className="p-2">
                    <select
                      form={`upd-${it.id}`}
                      name="sellerId"
                      defaultValue={it.sellerId || "none"}
                      className="border p-1 rounded"
                    >
                      <option value="none">—</option>
                      {sellers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      form={`upd-${it.id}`}
                      name="adminRate"
                      type="number"
                      step="0.01
