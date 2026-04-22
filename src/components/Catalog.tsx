import { useEffect, useMemo, useState } from "react";
import { loadCars, Car, statusOf } from "@/lib/auctions";
import CarCard from "./CarCard";
import { cn } from "@/lib/utils";

type Filter = "todos" | "live" | "upcoming" | "ended";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todos", label: "TODOS" },
  { id: "live", label: "AO VIVO" },
  { id: "upcoming", label: "EM BREVE" },
  { id: "ended", label: "ENCERRADOS" },
];

export default function Catalog() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filter, setFilter] = useState<Filter>("todos");

  useEffect(() => {
    const refresh = () => setCars(loadCars());
    refresh();
    window.addEventListener("topcar:cars-changed", refresh);
    window.addEventListener("storage", refresh);
    const id = setInterval(refresh, 30_000);
    return () => {
      window.removeEventListener("topcar:cars-changed", refresh);
      window.removeEventListener("storage", refresh);
      clearInterval(id);
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "todos") return cars;
    return cars.filter((c) => statusOf(c) === filter);
  }, [cars, filter]);

  return (
    <section id="catalogo" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Veículos em leilão</h2>
          <p className="mt-3 text-muted-foreground">
            Acompanhe os lances atuais e o tempo restante de cada leilão.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all",
                filter === f.id
                  ? "border-primary bg-primary text-primary-foreground shadow-elegant"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-gold/50",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {filtered.length === 0 ? (
            <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border/80 bg-card-gradient p-12 text-center">
              <p className="text-muted-foreground">Nenhum leilão disponível</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <CarCard key={c.id} car={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
