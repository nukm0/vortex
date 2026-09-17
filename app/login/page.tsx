import { login } from "./actions";

export const dynamic = "force-dynamic";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        action={login}
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl
                   border-2 border-purple-300 p-8 space-y-5
                   bg-gradient-to-br from-white to-purple-50"
      >
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
            Вход
          </h1>
          <p className="text-sm text-purple-700/70 mt-1">Админ-панель</p>
        </div>

        {searchParams.error && (
          <div className="bg-red-100 border-2 border-red-300 text-red-700 p-3 rounded-lg text-sm font-medium">
            ❌ Неверный логин или пароль
          </div>
        )}

        <div>
          <label className="label">Логин</label>
          <input
            name="login"
            required
            autoFocus
            className="input"
            defaultValue="owner"
          />
        </div>

        <div>
          <label className="label">Пароль</label>
          <input
            name="password"
            type="password"
            required
            className="input"
            defaultValue="owner"
          />
        </div>

        <button type="submit" className="btn-primary w-full text-base">
          ✅ Войти
        </button>

        <p className="text-xs text-purple-700/60 text-center">
          Тестовый вход: <b>owner</b> / <b>owner</b>
        </p>
      </form>
    </div>
  );
}
