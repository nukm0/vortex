import { store } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default function StatsPage() {
  const cities = store.cities;
  const sellers = store.sellers;
  const items = store.items;

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Статистика</h1>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">🏙 По городам</h2>
        <table className="w-full text-sm">
          <thead className="text-left bg-gray-100">
            <tr>
              <th className="p-2">Город</th>
              <th className="p-2">Позиций</th>
              <th className="p-2">Количество</th>
              <th className="p-2">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {byCity.map((r) => (
              <tr key={r.city} className="border-t">
                <td className="p-2">{r.city}</td>
                <td className="p-2">{r.count}</td>
                <td className="p-2">{r.qty}</td>
                <td className="p-2">{r.value.toLocaleString("ru-RU")} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">👤 По продавцам</h2>
        <table className="w-full text-sm">
          <thead className="text-left bg-gray-100">
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
              <tr key={r.name} className="border-t">
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.city}</td>
                <td className="p-2">{r.positions}</td>
                <td className="p-2">{r.qty}</td>
                <td className="p-2">{r.value.toLocaleString("ru-RU")} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
