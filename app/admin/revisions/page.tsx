import { store, findSeller, findItem, findCity } from "@/lib/mock-data";
import { createRevision, applyRevision } from "./actions";

export const dynamic = "force-dynamic";

export default function RevisionsPage() {
  const sellers = store.sellers;
  const revisions = store.revisions;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ревизии</h1>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-4">Создать ревизию</h2>
        <form action={createRevision} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select name="sellerId" required className="border p-2 rounded">
              <option value="">Выберите продавца</option>
              {sellers.map((s) => {
                const cnt = store.items.filter((i) => i.sellerId === s.id).length;
                return (
                  <option key={s.id} value={s.id} disabled={cnt === 0}>
                    {s.name} — {findCity(s.cityId)?.name} ({cnt} поз.)
                  </option>
                );
              })}
            </select>
            <input
              name="note"
              placeholder="Комментарий (необязательно)"
              className="border p-2 rounded"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Создать ревизию
          </button>
        </form>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-4">Последние ревизии</h2>
        <div className="space-y-3">
          {revisions.map((r) => {
            const seller = findSeller(r.sellerId);
            return (
              <div key={r.id} className="border rounded p-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="font-medium">
                      {seller?.name}{" "}
                      <span className="text-gray-500 text-sm">
                        ({findCity(seller?.cityId || "")?.name})
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleString("ru-RU")}
                      {r.note ? ` · ${r.note}` : ""}
                    </p>
                  </div>
                  <form action={applyRevision}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                      Применить
                    </button>
                  </form>
                </div>
                <ul className="mt-2 text-sm">
                  {r.items.map((ri, idx) => {
                    const item = findItem(ri.itemId);
                    const diff = ri.actual - ri.expected;
                    return (
                      <li key={idx} className="flex justify-between border-t py-1">
                        <span>{item?.name}</span>
                        <span>
                          ожидалось {ri.expected} · факт {ri.actual}{" "}
                          <span
                            className={
                              diff === 0
                                ? "text-gray-500"
                                : diff > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            ({diff > 0 ? "+" : ""}{diff})
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          {revisions.length === 0 && (
            <p className="text-gray-500">Ревизий пока нет</p>
          )}
        </div>
      </section>
    </div>
  );
}
