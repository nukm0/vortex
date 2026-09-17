import { prisma } from "@/lib/prisma";

export default async function AdminHome() {
  const [sellers, items, cities, revisions] = await Promise.all([
    prisma.seller.count(),
    prisma.item.count(),
    prisma.city.count(),
    prisma.revision.count(),
  ]);

  const cards = [
    { label: "Продавцов", value: sellers, color: "bg-blue-50 text-blue-700" },
    { label: "Товаров", value: items, color: "bg-green-50 text-green-700" },
    { label: "Городов", value: cities, color: "bg-purple-50 text-purple-700" },
    { label: "Ревизий", value: revisions, color: "bg-orange-50 text-orange-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Главная</h1>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`p-6 rounded shadow ${c.color}`}>
            <p className="text-sm">{c.label}</p>
            <p className="text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
