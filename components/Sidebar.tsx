"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const items = [
  { href: "/admin", label: "Главная", icon: "🏠" },
  { href: "/admin/categories", label: "Категории", icon: "🏷️" },
  { href: "/admin/sellers", label: "Продавцы", icon: "👤" },
  { href: "/admin/items", label: "Товары", icon: "📦" },
  { href: "/admin/balance", label: "Баланс", icon: "💰" },
  { href: "/admin/revisions", label: "Ревизии", icon: "📋" },
  { href: "/admin/stats", label: "Статистика", icon: "📊" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 p-4 flex flex-col min-h-screen text-white
                      bg-gradient-to-b from-purple-700 via-purple-800 to-purple-900
                      border-r-2 border-purple-300 shadow-2xl">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold tracking-tight">Админ</h1>
        <p className="text-xs text-purple-200">панель управления</p>
      </div>

      <nav className="space-y-1 flex-1">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-2.5 rounded-lg transition border-2 ${
                active
                  ? "bg-white text-purple-800 border-purple-300 shadow-lg font-semibold"
                  : "border-transparent hover:bg-purple-700/60 hover:border-purple-400"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 pt-4 border-t border-purple-500/50">
        <LogoutButton />
      </div>
    </aside>
  );
}
