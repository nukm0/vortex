import { store, findCategory, effectiveRate, findCity } from "@/lib/mock-data";

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
        category: findCategory(it.categoryId)?.name || "—",
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
      <h1 className="text-3xl font-bold text-purple-900">Баланс</h1>

      <div className="card-purple">
        <p className="text-sm text-purple-700">Итого к выплате всем продавцам</p>
        <p className="text-4xl font-bold text-green-600">
          {grandTotal.toLocaleString("ru-RU")} ₽
        </p>
      </div>

      {rows.map(({ seller, total, detail }) => (
        <div key={seller.id} className="card">
          <div className="flex justify-between items-baseline mb-3">
            <h2 className="font-semibold text-lg text-purple-900">
              {seller.name}{" "}
              <span className="text-purple-500 text-sm font-normal">
                ({findCity(seller.cityId)?.name})
              </span>
            </h2>
            <span className="text-2xl font-bold text-green-600">
              {total.toLocaleString("ru-RU")} ₽
            </span>
          </div>

          <table className="w-full text-sm">
            <thead className="text-purple-500 text-left border-b border-purple-100">
              <tr>
                <th className="py-2">Товар</th>
                <th className="py-2">Категория</th>
                <th className="py-2">Ставка</th>
                <th className="py-2">Источник</th>
                <th className="py-2">Кол-во</th>
                <th className="py-2">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {detail.map((d, i) => (
                <tr key={i} className="border-t border-purple-50">
                  <td className="py-1.5 text-purple-900">{d.name}</td>
                  <td className="py-1.5">
                    <span className="badge">{d.category}</span>
                  </td>
                  <td className="py-1.5">{d.rate} ₽</td>
                  <td className="py-1.5 text-xs">
                    <span
                      className={
                        d.source === "админ" ? "text-purple-600" : "text-gray-500"
                      }
                    >
                      {d.source}
                    </span>
                  </td>
                  <td className="py-1.5">{d.qty}</td>
                  <td className="py-1.5 font-medium text-green-700">
                    {d.sum.toLocaleString("ru-RU")} ₽
                  </td>
                </tr>
              ))}
              {detail.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-3 text-center text-purple-400">
                    Нет товаров
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
