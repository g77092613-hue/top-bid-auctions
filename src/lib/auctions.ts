export type AuctionStatus = "live" | "upcoming" | "ended";

export interface Bid {
  id: string;
  amount: number;
  bidder: string;
  at: string; // ISO
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  image: string;
  mileage: number;
  color: string;
  fuel: string;
  gearbox: string;
  engine: string;
  transmission: string;
  type: string;
  doors: number;
  plateEnd: string; // últimos 4
  startBid: number;
  minIncrement: number;
  startAt: string; // ISO
  endAt: string; // ISO
  bids: Bid[];
}

const KEY = "topcar_cars_v1";

const seed: Car[] = [
  {
    id: "c1",
    brand: "Toyota",
    model: "Corolla XEi",
    year: 2022,
    image:
      "https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=1200&q=80",
    mileage: 38000,
    color: "Prata",
    fuel: "Flex",
    gearbox: "Automático CVT",
    engine: "2.0 16V",
    transmission: "Dianteira",
    type: "Sedan",
    doors: 4,
    plateEnd: "4F21",
    startBid: 85000,
    minIncrement: 500,
    startAt: new Date(Date.now() - 3600_000).toISOString(),
    endAt: new Date(Date.now() + 3600_000 * 6).toISOString(),
    bids: [
      { id: "b1", amount: 85500, bidder: "João S.", at: new Date(Date.now() - 1800_000).toISOString() },
      { id: "b2", amount: 86500, bidder: "Marcos T.", at: new Date(Date.now() - 900_000).toISOString() },
    ],
  },
  {
    id: "c2",
    brand: "Jeep",
    model: "Compass Limited",
    year: 2023,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    mileage: 21000,
    color: "Preto",
    fuel: "Diesel",
    gearbox: "Automático 9M",
    engine: "2.0 Turbo",
    transmission: "4x4",
    type: "SUV",
    doors: 4,
    plateEnd: "7K88",
    startBid: 145000,
    minIncrement: 1000,
    startAt: new Date(Date.now() + 3600_000 * 24).toISOString(),
    endAt: new Date(Date.now() + 3600_000 * 72).toISOString(),
    bids: [],
  },
  {
    id: "c3",
    brand: "Honda",
    model: "Civic Touring",
    year: 2020,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
    mileage: 62000,
    color: "Branco",
    fuel: "Gasolina",
    gearbox: "Automático CVT",
    engine: "1.5 Turbo",
    transmission: "Dianteira",
    type: "Sedan",
    doors: 4,
    plateEnd: "2L09",
    startBid: 95000,
    minIncrement: 500,
    startAt: new Date(Date.now() - 3600_000 * 48).toISOString(),
    endAt: new Date(Date.now() - 3600_000 * 2).toISOString(),
    bids: [
      { id: "b3", amount: 96000, bidder: "Ana P.", at: new Date(Date.now() - 3600_000 * 10).toISOString() },
      { id: "b4", amount: 98500, bidder: "Felipe R.", at: new Date(Date.now() - 3600_000 * 3).toISOString() },
    ],
  },
];

export function loadCars(): Car[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as Car[];
  } catch {
    return seed;
  }
}

export function saveCars(cars: Car[]) {
  localStorage.setItem(KEY, JSON.stringify(cars));
  window.dispatchEvent(new Event("topcar:cars-changed"));
}

export function upsertCar(car: Car) {
  const cars = loadCars();
  const idx = cars.findIndex((c) => c.id === car.id);
  if (idx >= 0) cars[idx] = car;
  else cars.unshift(car);
  saveCars(cars);
}

export function deleteCar(id: string) {
  saveCars(loadCars().filter((c) => c.id !== id));
}

export function getCar(id: string): Car | undefined {
  return loadCars().find((c) => c.id === id);
}

export function statusOf(car: Car, now = Date.now()): AuctionStatus {
  const s = new Date(car.startAt).getTime();
  const e = new Date(car.endAt).getTime();
  if (now < s) return "upcoming";
  if (now > e) return "ended";
  return "live";
}

export function currentBid(car: Car): number {
  if (car.bids.length === 0) return car.startBid;
  return Math.max(...car.bids.map((b) => b.amount));
}

export function nextMinBid(car: Car): number {
  return currentBid(car) + car.minIncrement;
}

export function placeBid(id: string, bidder: string, amount: number): { ok: boolean; message: string } {
  const cars = loadCars();
  const car = cars.find((c) => c.id === id);
  if (!car) return { ok: false, message: "Veículo não encontrado." };
  const status = statusOf(car);
  if (status !== "live") return { ok: false, message: "Leilão não está ativo." };
  const min = nextMinBid(car);
  if (amount < min) return { ok: false, message: `Lance mínimo: ${formatBRL(min)}` };
  car.bids.push({
    id: Math.random().toString(36).slice(2),
    amount,
    bidder: bidder || "Anônimo",
    at: new Date().toISOString(),
  });
  saveCars(cars);
  return { ok: true, message: "Lance registrado!" };
}

export function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function formatKm(v: number): string {
  return v.toLocaleString("pt-BR") + " km";
}
