"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const items = [
  { href: "/admin/sellers", label: "Продавцы", icon: "👤" },
  { href: "/admin/items", label: "Товары", icon: "📦" },
  { href: "/admin/balance", label: "Баланс", icon: "💰" },
  { href: "/admin/revisions", label: "Ревизии", icon: "📋" },
  { href: "/admin/stats", label: "Статистика", icon: "📊" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-6">Админ-панель</h1>
      <nav className="space-y-1 flex-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 p-2 rounded transition ${
                active ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <LogoutButton />
    </aside>
  );
}
