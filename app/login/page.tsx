import { login } from "./actions";

export const dynamic = "force-dynamic";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        action={login}
        className="bg-white p-8 rounded-lg shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Вход</h1>

        {searchParams.error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
            Неверный логин или пароль
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">Логин</label>
          <input
            name="login"
            required
            autoFocus
            className="w-full border p-2 rounded"
            defaultValue="owner"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Пароль</label>
          <input
            name="password"
            type="password"
            required
            className="w-full border p-2 rounded"
            defaultValue="owner"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Войти
        </button>

        <p className="text-xs text-gray-500 text-center">
          Тестовый вход: owner / owner
        </p>
      </form>
    </div>
  );
}
