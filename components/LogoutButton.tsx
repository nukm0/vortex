"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="w-full text-left p-2 rounded hover:bg-gray-700 text-red-300"
    >
      🚪 Выйти
    </button>
  );
}
