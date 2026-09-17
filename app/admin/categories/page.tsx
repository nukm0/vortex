import { store } from "@/lib/mock-data";
import { createCategory, deleteCategory } from "./actions";

export const dynamic = "force-dynamic";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-purple-900">Категории</h1>

      <div className="card">
        <h2 className="section-title">➕ Добавить категорию</h2>
        <form action={createCategory} className="flex gap-3">
          <input
            name="name"
            placeholder="Название категории"
            required
            className="input flex-1"
          />
          <button type="submit" className="btn-primary">
            ✅ Создать
          </button>
        </form>
        <p className="text-xs text-purple-700/70 mt-2">
          После создания категория появится в формах продавцов и товаров.
        </p>
      </div>

      <div className="card">
        <h2 className="section-title">🏷️ Список категорий</h2>

        {store.categories.length === 0 ? (
          <p className="text-purple-700/60 py-4 text-center">
            Категорий пока нет — создайте первую
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {store.categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full
                           bg-purple-50 border-2 border-purple-200"
              >
                <span className="font-medium text-purple-900">{c.name}</span>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    className="text-red-500 hover:text-red-700 font-bold"
                    title="Удалить"
                  >
                    ✕
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-red-600 mt-4">
          ⚠️ При удалении категории удалятся все товары с этой категорией.
        </p>
      </div>
    </div>
  );
}
