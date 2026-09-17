import { prisma } from "@/lib/prisma";

export default async function BalancePage() {
  const sellers = await prisma.seller.findMany({
    include: { items: true, city: true },
  });

  const rows = sellers.map((s) => {
    const rates = (s.ratesJson as Record<string, number> | null) || {};
    let total = 0;
    const detail: { name: string; rate: number; qty: number; sum: number }[] = [];

    for (const it of s.items) {
      const rate =
        it.adminRate !== null
          ? Number(it.adminRate)
          : rates[it.category] ?? rates.general ?? 0;
      const sum = rate * it.quantity;
      total += sum;
      detail.push({ name: it.name, rate, qty: it.quantity, sum });
    }
    return { seller: s, total, detail };
  });

  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Баланс</h1>

      <div className="bg-white p-6 rounded shadow">
        <p className="text-sm text-gray-600">Итого к выплате всем продавцам</p>
        <p className="text-3xl font-bold text-green-700">
          {grandTotal.toLocaleString("ru-RU")} ₽
        </p>
      </div>

      <div className="space-y-4">
        {rows.map(({ seller, total, detail }) => (
          <div key={seller.id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-baseline mb-3">
              <h2 className="font-semibold">
                {seller.name}{" "}
                <span className="text-gray-500 text-sm">({seller.city.name})</span>
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
                  <th className="py-1">Кол-во</th>
                  <th className="py-1">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {detail.map((d, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-1">{d.name}</td>
                    <td className="py-1">{d.rate} ₽</td>
                    <td className="py-1">{d.qty}</td>
                    <td className="py-1">{d.sum.toLocaleString("ru-RU")} ₽</td>
                  </tr>
                ))}
                {detail.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-2 text-gray-500">
                      Нет товаров
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
