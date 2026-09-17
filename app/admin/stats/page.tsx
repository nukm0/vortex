import { prisma } from "@/lib/prisma";

export default async function StatsPage() {
  const [cities, sellers, items] = await Promise.all([
    prisma.city.findMany(),
    prisma.seller.findMany({ include: { city: true, items: true } }),
    prisma.item.findMany({ include: { city: true } }),
  ]);

  // По городам
  const byCity = cities.map((c) => {
    const cityItems = items.filter((i) => i.cityId === c.id);
    const qty = cityItems.reduce((s, i) => s + i.quantity, 0);
    const value = cityItems.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
    return { city: c.name, qty, value, count: cityItems.length };
  });

  // По продавцам
  const bySeller = sellers.map((s) => {
    const qty = s.items.reduce((sum, i) => sum + i.quantity, 0);
    const value = s.items.reduce(
      (sum, i) => sum + Number(i.price) * i.quantity,
      0
    );
    return { name: s.name, city: s.city.name, qty, value, positions: s.items.length };
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
