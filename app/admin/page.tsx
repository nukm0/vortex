import { store } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default function AdminHome() {
  const cards = [
    { label: "Продавцов", value: store.sellers.length, color: "bg-blue-50 text-blue-700" },
    { label: "Товаров", value: store.items.length, color: "bg-green-50 text-green-700" },
    { label: "Городов", value: store.cities.length, color: "bg-purple-50 text-purple-700" },
    { label: "Ревизий", value: store.revisions.length, color: "bg-orange-50 text-orange-700" },
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
      <div className="mt-8 bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded">
        ⚠️ Тестовый режим: данные хранятся в памяти и сбрасываются при перезапуске сервера.
      </div>
    </div>
  );
}
