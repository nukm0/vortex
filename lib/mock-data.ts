// In-memory хранилище. Данные сбрасываются при перезапуске сервера.

export type City = { id: string; name: string };

export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export type Seller = {
  id: string;
  name: string;
  phone: string | null;
  username: string | null;
  cityId: string;
  rates: Record<string, number>; // categoryId -> ставка
  createdAt: string;
};

export type Item = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: string;
  cityId: string;
  sellerId: string | null;
  adminRate: number | null;
  createdAt: string;
};

export type RevisionItem = {
  itemId: string;
  expected: number;
  actual: number;
};

export type Revision = {
  id: string;
  sellerId: string;
  note: string | null;
  items: RevisionItem[];
  createdAt: string;
};

type Store = {
  cities: City[];
  categories: Category[];
  sellers: Seller[];
  items: Item[];
  revisions: Revision[];
};

const globalStore = global as unknown as { __store?: Store };

function seed(): Store {
  const cities: City[] = [
    { id: "c1", name: "Москва" },
    { id: "c2", name: "Санкт-Петербург" },
    { id: "c3", name: "Казань" },
  ];

  const categories: Category[] = [
    { id: "cat1", name: "Электроника", createdAt: new Date().toISOString() },
    { id: "cat2", name: "Одежда", createdAt: new Date().toISOString() },
    { id: "cat3", name: "Еда", createdAt: new Date().toISOString() },
  ];

  const sellers: Seller[] = [
    {
      id: "s1",
      name: "Иван Петров",
      phone: "+79990001122",
      username: "@ivan",
      cityId: "c1",
      rates: { cat1: 120, cat2: 80, cat3: 40 },
      createdAt: new Date().toISOString(),
    },
    {
      id: "s2",
      name: "Анна Смирнова",
      phone: "+79993334455",
      username: "@anna",
      cityId: "c2",
      rates: { cat1: 100, cat2: 70, cat3: 30 },
      createdAt: new Date().toISOString(),
    },
  ];

  const items: Item[] = [
    {
      id: "i1",
      name: "iPhone 15",
      price: 90000,
      quantity: 3,
      categoryId: "cat1",
      cityId: "c1",
      sellerId: "s1",
      adminRate: 50,
      createdAt: new Date().toISOString(),
    },
    {
      id: "i2",
      name: "Футболка Nike",
      price: 3000,
      quantity: 10,
      categoryId: "cat2",
      cityId: "c1",
      sellerId: "s1",
      adminRate: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: "i3",
      name: "Кофе Lavazza",
      price: 800,
      quantity: 20,
      categoryId: "cat3",
      cityId: "c2",
      sellerId: "s2",
      adminRate: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: "i4",
      name: "Samsung TV",
      price: 55000,
      quantity: 5,
      categoryId: "cat1",
      cityId: "c2",
      sellerId: null,
      adminRate: 100,
      createdAt: new Date().toISOString(),
    },
  ];

  return { cities, categories, sellers, items, revisions: [] };
}

export const store: Store = globalStore.__store ?? seed();
globalStore.__store = store;

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function findCity(id: string) {
  return store.cities.find((c) => c.id === id) ?? null;
}

export function findCategory(id: string) {
  return store.categories.find((c) => c.id === id) ?? null;
}

export function findSeller(id: string) {
  return store.sellers.find((s) => s.id === id) ?? null;
}

export function findItem(id: string) {
  return store.items.find((i) => i.id === id) ?? null;
}

// Ставка: приоритет — adminRate, иначе ставка продавца по категории товара
export function effectiveRate(item: Item, seller: Seller | null): number {
  if (item.adminRate !== null) return item.adminRate;
  if (!seller) return 0;
  return seller.rates[item.categoryId] ?? 0;
}
