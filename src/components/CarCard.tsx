import { Link } from "react-router-dom";
import { Car, currentBid, formatBRL, formatKm, statusOf } from "@/lib/auctions";
import { useCountdown } from "@/hooks/useCountdown";
import { Gauge, Fuel, Cog, Clock } from "lucide-react";

function StatusBadge({ status }: { status: "live" | "upcoming" | "ended" }) {
  if (status === "live")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/30 animate-pulse-red">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> AO VIVO
      </span>
    );
  if (status === "upcoming")
    return <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold ring-1 ring-gold/30">EM BREVE</span>;
  return <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-border">ENCERRADO</span>;
}

function Timer({ target, label }: { target: string; label: string }) {
  const { d, h, m, s, done } = useCountdown(target);
  if (done) return <span className="text-muted-foreground">{label} finalizado</span>;
  return (
    <div className="flex items-center gap-1.5 text-sm tabular-nums">
      <Clock className="h-3.5 w-3.5 text-gold" />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">
        {d > 0 && `${d}d `}
        {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
      </span>
    </div>
  );
}

export default function CarCard({ car }: { car: Car }) {
  const status = statusOf(car);
  const bid = currentBid(car);
  const target = status === "upcoming" ? car.startAt : car.endAt;
  const label = status === "upcoming" ? "Inicia em" : status === "live" ? "Encerra em" : "";

  return (
    <Link
      to={`/carro/${car.id}`}
      className="group overflow-hidden rounded-2xl border border-border/60 bg-card-gradient shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <StatusBadge status={status} />
          <span className="rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
            {car.year}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="font-display text-lg font-bold text-white">{car.brand} {car.model}</h3>
          <p className="text-xs text-white/70">{car.type} · {car.color}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5 text-gold" /> {formatKm(car.mileage)}</div>
          <div className="flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5 text-gold" /> {car.fuel}</div>
          <div className="flex items-center gap-1.5"><Cog className="h-3.5 w-3.5 text-gold" /> {car.gearbox.split(" ")[0]}</div>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-border/60 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Lance atual</p>
            <p className="font-display text-2xl font-bold text-gold">{formatBRL(bid)}</p>
          </div>
          {status !== "ended" && <Timer target={target} label={label} />}
        </div>
      </div>
    </Link>
  );
}
