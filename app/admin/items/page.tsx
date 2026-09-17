import { store, findCity, findCategory, findSeller } from "@/lib/mock-data";
import { createItem, deleteItem, updateItem } from "./actions";

export const dynamic = "force-dynamic";

export default function ItemsPage() {
  const { items, cities, sellers, categories } = store;

  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
  const totalValue = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const bySeller = new Map<
    string,
    { seller: (typeof sellers)[number]; items: typeof items }
  >();
  for (const it of items) {
    if (!it.sellerId) continue;
    const seller = findSeller(it.sellerId);
    if (!seller) continue;
    if (!bySeller.has(seller.id)) bySeller.set(seller.id, { seller, items: [] });
    bySeller.get(seller.id)!.items.push(it);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-purple-900">Товары</h1>

      {/* Статистика */}
      <section className="card-purple">
        <h2 className="section-title">📊 Общее количество</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border-2 border-purple-200">
            <p className="text-sm text-purple-700">Всего товара</p>
            <p className="text-4xl font-bold text-purple-900">
              {totalQuantity} <span className="text-lg font-medium">шт.</span>
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border-2 border-green-200">
            <p className="text-sm text-green-700">Сумма прибыли после продажи всего</p>
            <p className="text-4xl font-bold text-green-700">
              {totalValue.toLocaleString("ru-RU")}{" "}
              <span className="text-lg font-medium">₽</span>
            </p>
          </div>
        </div>
      </section>

      {/* Персонал */}
      <section className="card">
        <h2 className="section-title">👥 Товары у персонала</h2>
        {bySeller.size === 0 && (
          <p className="text-purple-400 py-3">Товары пока никому не назначены</p>
        )}
        <div className="space-y-3">
          {[...bySeller.values()].map(({ seller, items: sItems }) => {
            const qty = sItems.reduce((s, i) => s + i.quantity, 0);
            const val = sItems.reduce((s, i) => s + i.price * i.quantity, 0);
            return (
              <div
                key={seller.id}
                className="border-2 border-purple-100 rounded-xl p-4 bg-purple-50/40"
              >
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-semibold text-purple-900">
                    {seller.name}{" "}
                    <span className="text-purple-500 text-sm font-normal">
                      ({findCity(seller.cityId)?.name})
                    </span>
                  </h3>
                  <div className="text-sm font-medium text-purple-700">
                    {qty} шт. · {val.toLocaleString("ru-RU")} ₽
                  </div>
                </div>
                <ul className="text-sm space-y-1">
                  {sItems.map((it) => (
                    <li key={it.id} className="flex justify-between border-t border-purple-100 pt-1">
                      <span className="text-purple-900">{it.name}</span>
                      <span className="text-purple-600">
                        {it.quantity} шт. × {it.price} ₽
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Создание */}
      <section className="card">
        <h2 className="section-title">➕ Добавить карточку товара</h2>

        {categories.length === 0 && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
            ❌ Сначала создайте хотя бы одну категорию в разделе <b>«Категории»</b>.
          </div>
        )}

        <form action={createItem} className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Название</label>
            <input name="name" placeholder="Название товара" required className="input" />
          </div>

          <div>
            <label className="label">Цена, ₽</label>
            <input name="price" type="number" step="0.01" placeholder="0" required className="input" />
          </div>

          <div>
            <label className="label">Город</label>
            <select name="cityId" required className="input">
              <option value="">Выберите город</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Категория</label>
            <select name="categoryId" required className="input">
              <option value="">Выберите категорию</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Продавец</label>
            <select name="sellerId" className="input" defaultValue="none">
              <option value="none">Без продавца (на складе)</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {findCity(s.cityId)?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Ставка админа (приоритетная)</label>
            <input
              name="adminRate"
              type="number"
              step="0.01"
              placeholder="Пусто = ставка продавца"
              className="input"
            />
          </div>

          <div>
            <label className="label">Количество</label>
            <input name="quantity" type="number" defaultValue={1} min={1} className="input" />
          </div>

          <div className="col-span-2 flex gap-2 pt-2">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={categories.length === 0}
            >
              ✅ Создать товар
            </button>
            <button type="reset" className="btn-danger">❌ Очистить</button>
          </div>
        </form>
      </section>

      {/* Список */}
      <section className="card p-0 overflow-hidden">
        <div className="p-5 pb-3">
          <h2 className="section-title mb-0">📋 Все товары</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="table-head">
              <tr>
                <th className="p-2">Название</th>
                <th className="p-2">Цена</th>
                <th className="p-2">Кол-во</th>
                <th className="p-2">Категория</th>
                <th className="p-2">Город</th>
                <th className="p-2">Продавец</th>
                <th className="p-2">Ставка админа</th>
                <th className="p-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const cat = findCategory(it.categoryId);
                return (
                  <tr key={it.id} className="border-t border-purple-100 hover:bg-purple-50/40">
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
                          className="input py-1 text-sm"
                        />
                      </form>
                    </td>
                    <td className="p-2">
                      <input
                        form={`upd-${it.id}`}
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={it.price}
                        className="input py-1 text-sm w-24"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        form={`upd-${it.id}`}
                        name="quantity"
                        type="number"
                        defaultValue={it.quantity}
                        className="input py-1 text-sm w-20"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        form={`upd-${it.id}`}
                        name="categoryId"
                        defaultValue={it.categoryId}
                        className="input py-1 text-sm"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 text-purple-700">
                      {findCity(it.cityId)?.name}
                    </td>
                    <td className="p-2">
                      <select
                        form={`upd-${it.id}`}
                        name="sellerId"
                        defaultValue={it.sellerId || "none"}
                        className="input py-1 text-sm"
                      >
                        <option value="none">—</option>
                        {sellers.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        form={`upd-${it.id}`}
                        name="adminRate"
                        type="number"
                        step="0.01"
                        defaultValue={it.adminRate ?? ""}
                        placeholder="по продавцу"
                        className="input py-1 text-sm w-28"
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button
                          form={`upd-${it.id}`}
                          type="submit"
                          className="btn-primary btn-sm"
                        >
                          Сохранить
                        </button>
                        <form action={deleteItem}>
                          <input type="hidden" name="id" value={it.id} />
                          <button className="btn-danger btn-sm">Удалить</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-purple-400">
                    Товаров пока нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
