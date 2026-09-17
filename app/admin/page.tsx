import Link from "next/link";
import { store } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default function AdminHome() {
  const cards = [
    { label: "Категорий", value: store.categories.length, icon: "🏷️", href: "/admin/categories" },
    { label: "Продавцов", value: store.sellers.length, icon: "👤", href: "/admin/sellers" },
    { label: "Товаров", value: store.items.length, icon: "📦", href: "/admin/items" },
    { label: "Ревизий", value: store.revisions.length, icon: "📋", href: "/admin/revisions" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-purple-900">Главная</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="card-purple hover:shadow-2xl transition transform hover:-translate-y-1 block"
          >
            <div className="text-3xl mb-2">{c.icon}</div>
            <p className="text-sm text-purple-700">{c.label}</p>
            <p className="text-4xl font-bold text-purple-900">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-300 text-yellow-900 p-4 rounded-xl">
        ⚠️ <b>Тестовый режим:</b> данные хранятся в памяти и сбрасываются при
        перезапуске сервера.
      </div>
    </div>
  );
}
