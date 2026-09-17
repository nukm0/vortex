import { store, effectiveRate } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default function BalancePage() {
  const rows = store.sellers.map((s) => {
    const sItems = store.items.filter((i) => i.sellerId === s.id);
    let total = 0;
    const detail = sItems.map((it) => {
      const rate = effectiveRate(it, s);
      const sum = rate * it.quantity;
      total += sum;
      return {
        name: it.name,
        rate,
        qty: it.quantity,
        sum,
        source: it.adminRate !== null ? "админ" : "продавец",
      };
    });
    return { seller: s, total, detail };
  });

  const grandTotal = rows.reduce((s, r) => s + r.total, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Баланс</h1>

      <div className="bg-white p-6 rounded shadow">
        <p className="text-sm text-gray-600">Итого к выплате всем продавцам</p>
        <p className="text-3xl font-bold text-green-700">{grandTotal.toLocaleString("ru-RU")} ₽</p>
      </div>

      <div className="space-y-4">
        {rows.map(({ seller, total, detail }) => (
          <div key={seller.id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-baseline mb-3">
              <h2 className="font-semibold">
                {seller.name}{" "}
                <span className="text-gray-500 text-sm">
                  ({store.cities.find((c) => c.id === seller.cityId)?.name})
                </span>
              </h2>
              <span className="text-lg font-bold text-green-700">
                {total.toLocaleString("ru-RU")} ₽
              </span>
            </div>
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-left">
                <tr>
                  <th className="py-1">Товар</th>
                  <th className="py-1">Ставка</th>
                  <th className="py-1">Источник</th>
                  <th className="py-1">Кол-во</th>
                  <th className="py-1">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {detail.map((d, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-1">{d.name}</td>
                    <td className="py-1">{d.rate} ₽</td>
                    <td className="py-1 text-xs text-gray-500">{d.source}</td>
                    <td className="py-1">{d.qty}</td>
                    <td className="py-1">{d.sum.toLocaleString("ru-RU")} ₽</td>
                  </tr>
                ))}
                {detail.length === 0 && (
                  <tr><td colSpan={5} className="py-2 text-gray-500">Нет товаров</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
