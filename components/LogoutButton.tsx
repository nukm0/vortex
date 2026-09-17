"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full text-left p-2 rounded hover:bg-gray-700 text-red-300"
    >
      🚪 Выйти
    </button>
  );
}
