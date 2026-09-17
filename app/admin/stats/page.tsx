import { store, findCategory } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default function StatsPage() {
  const { cities, sellers, items, categories } = store;

  const byCity = cities.map((c) => {
    const cityItems = items.filter((i) => i.cityId === c.id);
    const qty = cityItems.reduce((s, i) => s + i.quantity, 0);
    const value = cityItems.reduce((s, i) => s + i.price * i.quantity, 0);
    return { city: c.name, qty, value, count: cityItems.length };
  });

  const bySeller = sellers.map((s) => {
    const sItems = items.filter((i) => i.sellerId === s.id);
    const qty = sItems.reduce((sum, i) => sum + i.quantity, 0);
    const value = sItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return {
      name: s.name,
      city: cities.find((c) => c.id === s.cityId)?.name || "—",
      qty,
      value,
      positions: sItems.length,
    };
  });

  const byCategory = categories.map((cat) => {
    const catItems = items.filter((i) => i.categoryId === cat.id);
    const qty = catItems.reduce((s, i) => s + i.quantity, 0);
    const value = catItems.reduce((s, i) => s + i.price * i.quantity, 0);
    return { name: cat.name, qty, value, count: catItems.length };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-purple-900">Статистика</h1>

      <section className="card">
        <h2 className="section-title">🏷️ По категориям</h2>
        <table className="w-full text-sm">
          <thead className="table-head">
            <tr>
              <th className="p-2">Категория</th>
              <th className="p-2">Позиций</th>
              <th className="p-2">Количество</th>
              <th className="p-2">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {byCategory.map((r) => (
              <tr key={r.name} className="border-t border-purple-50">
                <td className="p-2 font-medium text-purple-900">{r.name}</td>
                <td className="p-2">{r.count}</td>
                <td className="p-2">{r.qty}</td>
                <td className="p-2 font-medium text-green-700">
                  {r.value.toLocaleString("ru-RU")} ₽
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2 className="section-title">🏙 По городам</h2>
        <table className="w-full text-sm">
          <thead className="table-head">
            <tr>
              <th className="p-2">Город</th>
              <th className="p-2">Позиций</th>
              <th className="p-2">Количество</th>
              <th className="p-2">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {byCity.map((r) => (
              <tr key={r.city} className="border-t border-purple-50">
                <td className="p-2 font-medium text-purple-900">{r.city}</td>
                <td className="p-2">{r.count}</td>
                <td className="p-2">{r.qty}</td>
                <td className="p-2 font-medium text-green-700">
                  {r.value.toLocaleString("ru-RU")} ₽
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2 className="section-title">👤 По продавцам</h2>
        <table className="w-full text-sm">
          <thead className="table-head">
            <tr>
              <th className="p-2">Продавец</th>
              <th className="p-2">Город</th>
              <th className="p-2">Позиций</th>
              <th className="p-2">Количество</th>
              <th className="p-2">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {bySeller.map((r) => (
              <tr key={r.name} className="border-t border-purple-50">
                <td className="p-2 font-medium text-purple-900">{r.name}</td>
                <td className="p-2">{r.city}</td>
                <td className="p-2">{r.positions}</td>
                <td className="p-2">{r.qty}</td>
                <td className="p-2 font-medium text-green-700">
                  {r.value.toLocaleString("ru-RU")} ₽
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
