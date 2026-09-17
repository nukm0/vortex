import { store, findCity } from "@/lib/mock-data";
import { createSeller, deleteSeller } from "./actions";

export const dynamic = "force-dynamic";

export default function SellersPage() {
  const { sellers, cities, categories } = store;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-purple-900">Продавцы</h1>

      <div className="card">
        <h2 className="section-title">➕ Добавить продавца</h2>

        {categories.length === 0 && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
            ❌ Сначала создайте хотя бы одну категорию в разделе{" "}
            <b>«Категории»</b>.
          </div>
        )}

        <form action={createSeller} className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Имя</label>
            <input name="name" placeholder="Иван Иванов" required className="input" />
          </div>

          <div>
            <label className="label">Телефон</label>
            <input name="phone" placeholder="+7..." className="input" />
          </div>

          <div>
            <label className="label">Username</label>
            <input name="username" placeholder="@username" className="input" />
          </div>

          <div>
            <label className="label">Город привязки</label>
            <select name="cityId" required className="input">
              <option value="">Выберите город</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {categories.length > 0 && (
            <div className="col-span-2">
              <p className="label">Ставка за товар по категориям (₽)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="relative">
                    <input
                      name={`rate_${cat.id}`}
                      type="number"
                      step="0.01"
                      placeholder={cat.name}
                      className="input"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="col-span-2 flex gap-2 pt-2">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={categories.length === 0}
            >
              ✅ Создать продавца
            </button>
            <button type="reset" className="btn-danger">
              ❌ Очистить
            </button>
          </div>
        </form>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead className="table-head">
            <tr>
              <th className="p-3">Имя</th>
              <th className="p-3">Телефон</th>
              <th className="p-3">Username</th>
              <th className="p-3">Город</th>
              <th className="p-3">Ставки</th>
              <th className="p-3">Товаров</th>
              <th className="p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => {
              const city = findCity(s.cityId);
              const itemCount = store.items.filter((i) => i.sellerId === s.id).length;
              return (
                <tr key={s.id} className="border-t border-purple-100 hover:bg-purple-50/40">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3 text-purple-700">{s.phone || "—"}</td>
                  <td className="p-3 text-purple-700">{s.username || "—"}</td>
                  <td className="p-3">
                    <span className="badge">{city?.name || "—"}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {categories.map((cat) => {
                        const rate = s.rates[cat.id];
                        if (rate === undefined) return null;
                        return (
                          <span key={cat.id} className="badge">
                            {cat.name}: {rate}₽
                          </span>
                        );
                      })}
                      {Object.keys(s.rates).length === 0 && (
                        <span className="text-xs text-purple-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold text-purple-900">
                    {itemCount}
                  </td>
                  <td className="p-3">
                    <form action={deleteSeller}>
                      <input type="hidden" name="id" value={s.id} />
                      <button className="btn-danger btn-sm">Удалить</button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {sellers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-purple-400">
                  Пока нет продавцов
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
