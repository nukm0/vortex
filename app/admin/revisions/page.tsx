import { store, findSeller, findItem, findCity } from "@/lib/mock-data";
import { createRevision, applyRevision } from "./actions";

export const dynamic = "force-dynamic";

export default function RevisionsPage() {
  const { sellers, revisions } = store;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-purple-900">Ревизии</h1>

      <section className="card">
        <h2 className="section-title">➕ Создать ревизию</h2>
        <form action={createRevision} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Продавец</label>
              <select name="sellerId" required className="input">
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
            </div>
            <div>
              <label className="label">Комментарий</label>
              <input name="note" placeholder="Необязательно" className="input" />
            </div>
          </div>
          <button className="btn-primary">✅ Создать ревизию</button>
        </form>
      </section>

      <section className="card">
        <h2 className="section-title">📋 Последние ревизии</h2>
        <div className="space-y-3">
          {revisions.map((r) => {
            const seller = findSeller(r.sellerId);
            return (
              <div key={r.id} className="border-2 border-purple-100 rounded-xl p-4">
                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <p className="font-semibold text-purple-900">
                      {seller?.name}{" "}
                      <span className="text-purple-500 text-sm font-normal">
                        ({findCity(seller?.cityId || "")?.name})
                      </span>
                    </p>
                    <p className="text-xs text-purple-500">
                      {new Date(r.createdAt).toLocaleString("ru-RU")}
                      {r.note ? ` · ${r.note}` : ""}
                    </p>
                  </div>
                  <form action={applyRevision}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="btn-primary btn-sm">✅ Применить</button>
                  </form>
                </div>
                <ul className="text-sm">
                  {r.items.map((ri, idx) => {
                    const item = findItem(ri.itemId);
                    const diff = ri.actual - ri.expected;
                    return (
                      <li
                        key={idx}
                        className="flex justify-between border-t border-purple-50 py-1"
                      >
                        <span className="text-purple-900">{item?.name}</span>
                        <span>
                          ожидалось {ri.expected} · факт {ri.actual}{" "}
                          <span
                            className={
                              diff === 0
                                ? "text-gray-500"
                                : diff > 0
                                ? "text-green-600 font-medium"
                                : "text-red-600 font-medium"
                            }
                          >
                            ({diff > 0 ? "+" : ""}
                            {diff})
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
            <p className="text-purple-400 py-3">Ревизий пока нет</p>
          )}
        </div>
      </section>
    </div>
  );
}
