"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      login,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError("Неверный логин или пароль");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-lg shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Вход</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm mb-1">Логин</label>
          <input
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full border p-2 rounded"
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Войти
        </button>
        <p className="text-xs text-gray-500 text-center">
          По умолчанию: owner / owner
        </p>
      </form>
    </div>
  );
}
