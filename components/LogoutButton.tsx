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
      className="w-full text-left p-2.5 rounded-lg transition border-2 border-red-400/60
                 bg-red-500/20 hover:bg-red-500 text-white font-medium"
    >
      🚪 Выйти
    </button>
  );
}
