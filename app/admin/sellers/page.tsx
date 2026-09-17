import { store, findCity } from "@/lib/mock-data";
import { createSeller, deleteSeller } from "./actions";

export const dynamic = "force-dynamic";

export default function SellersPage() {
  const sellers = store.sellers;
  const cities = store.cities;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Продавцы</h1>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-4">Добавить продавца</h2>
        <form action={createSeller} className="grid grid-cols-2 gap-4">
          <input name="name" placeholder="Имя" required className="border p-2 rounded" />
          <input name="phone" placeholder="Номер телефона" className="border p-2 rounded" />
          <input name="username" placeholder="@username" className="border p-2 rounded" />

          <select name="cityId" required className="border p-2 rounded">
            <option value="">Выберите город</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <div className="col-span-2">
            <p className="text-sm text-gray-600 mb-2">Ставка за товар по категориям (₽):</p>
            <div className="grid grid-cols-4 gap-2">
              <input name="rate_electronics" type="number" step="0.01" placeholder="Электроника" className="border p-2 rounded" />
              <input name="rate_clothing" type="number" step="0.01" placeholder="Одежда" className="border p-2 rounded" />
              <input name="rate_food" type="number" step="0.01" placeholder="Еда" className="border p-2 rounded" />
              <input name="rate_general" type="number" step="0.01" placeholder="Общая" className="border p-2 rounded" />
            </div>
          </div>

          <button type="submit" className="bg-blue-600 text-white p-2 rounded col-span-2 hover:bg-blue-700">
            Создать продавца
          </button>
        </form>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Имя</th>
              <th className="p-3">Телефон</th>
              <th className="p-3">Username</th>
              <th className="p-3">Город</th>
              <th className="p-3">Ставки</th>
              <th className="p-3">Товаров</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => {
              const city = findCity(s.cityId);
              const itemCount = store.items.filter((i) => i.sellerId === s.id).length;
              return (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.phone || "—"}</td>
                  <td className="p-3">{s.username || "—"}</td>
                  <td className="p-3">{city?.name || "—"}</td>
                  <td className="p-3 text-xs">
                    {Object.entries(s.rates).map(([k, v]) => `${k}: ${v}₽`).join(", ") || "—"}
                  </td>
                  <td className="p-3">{itemCount}</td>
                  <td className="p-3">
                    <form action={deleteSeller}>
                      <input type="hidden" name="id" value={s.id} />
                      <button className="text-red-600 hover:underline">Удалить</button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {sellers.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-gray-500">Пока нет продавцов</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
