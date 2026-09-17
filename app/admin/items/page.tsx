import { store, findCity, findSeller } from "@/lib/mock-data";
import { createItem, deleteItem, updateItem } from "./actions";

export const dynamic = "force-dynamic";

export default function ItemsPage() {
  const items = store.items;
  const cities = store.cities;
  const sellers = store.sellers;

  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
  const totalValue = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const bySeller = new Map<string, { seller: typeof sellers[number]; items: typeof items }>();
  for (const it of items) {
    if (!it.sellerId) continue;
    const seller = findSeller(it.sellerId);
    if (!seller) continue;
    if (!bySeller.has(seller.id)) bySeller.set(seller.id, { seller, items: [] });
    bySeller.get(seller.id)!.items.push(it);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Товары</h1>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">📊 Общее количество</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Всего товара</p>
            <p className="text-3xl font-bold">{totalQuantity} шт.</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">Сумма прибыли после продажи всего</p>
            <p className="text-3xl font-bold">{totalValue.toLocaleString("ru-RU")} ₽</p>
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">👥 Товары у персонала</h2>
        {bySeller.size === 0 && <p className="text-gray-500">Товары пока никому не назначены</p>}
        <div className="space-y-4">
          {[...bySeller.values()].map(({ seller, items: sItems }) => {
            const qty = sItems.reduce((s, i) => s + i.quantity, 0);
            const val = sItems.reduce((s, i) => s + i.price * i.quantity, 0);
            return (
              <div key={seller.id} className="border rounded p-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">
                    {seller.name} <span className="text-gray-500">({findCity(seller.cityId)?.name})</span>
                  </h3>
                  <div className="text-sm text-gray-600">
                    {qty} шт. · {val.toLocaleString("ru-RU")} ₽
                  </div>
                </div>
                <ul className="mt-2 text-sm space-y-1">
                  {sItems.map((it) => (
                    <li key={it.id}>• {it.name} — {it.quantity} шт. × {it.price} ₽</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">➕ Добавить карточку товара</h2>
        <form action={createItem} className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="Название" required className="border p-2 rounded" />
          <input name="price" type="number" step="0.01" placeholder="Цена" required className="border p-2 rounded" />

          <select name="cityId" required className="border p-2 rounded">
            <option value="">Город</option>
            {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
              <option key={s.id} value={s.id}>{s.name} — {findCity(s.cityId)?.name}</option>
            ))}
          </select>

          <input name="adminRate" type="number" step="0.01" placeholder="Ставка админа (пусто = ставка продавца)" className="border p-2 rounded" />

          <input name="quantity" type="number" defaultValue={1} min={1} className="border p-2 rounded" />

          <button type="submit" className="bg-blue-600 text-white p-2 rounded col-span-2 hover:bg-blue-700">
            Создать товар
          </button>
        </form>
      </section>

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
                  <td className="p-2" colSpan={6}>
                    <form action={updateItem} id={`upd-${it.id}`} className="grid grid-cols-6 gap-2 items-center">
                      <input type="hidden" name="id" value={it.id} />
                      <input name="name" defaultValue={it.name} className="border p-1 rounded" />
                      <input name="price" type="number" step="0.01" defaultValue={it.price} className="border p-1 rounded" />
                      <input name="quantity" type="number" defaultValue={it.quantity} className="border p-1 rounded" />
                      <span>{findCity(it.cityId)?.name}</span>
                      <select name="sellerId" defaultValue={it.sellerId || "none"} className="border p-1 rounded">
                        <option value="none">—</option>
                        {sellers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <input name="adminRate" type="number" step="0.01" defaultValue={it.adminRate ?? ""} placeholder="ставка продавца" className="border p-1 rounded" />
                    </form>
                  </td>
                  <td className="p-2 flex gap-2">
                    <button form={`upd-${it.id}`} type="submit" className="text-blue-600 hover:underline">Сохранить</button>
                    <form action={deleteItem}>
                      <input type="hidden" name="id" value={it.id} />
                      <button className="text-red-600 hover:underline">Удалить</button>
                    </form>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={7} className="p-6 text-center text-gray-500">Товаров пока нет</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
