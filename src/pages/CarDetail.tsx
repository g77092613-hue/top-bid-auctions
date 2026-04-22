import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCountdown } from "@/hooks/useCountdown";
import {
  getCar, currentBid, nextMinBid, placeBid, statusOf, formatBRL, formatKm, Car,
} from "@/lib/auctions";
import { ArrowLeft, Gauge, Fuel, Cog, Car as CarIcon, Palette, Hash, Gavel, MessageCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const WHATS = "https://wa.me/5511934516708";

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | undefined>(() => (id ? getCar(id) : undefined));
  const [bidder, setBidder] = useState("");
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    const refresh = () => setCar(getCar(id));
    refresh();
    window.addEventListener("topcar:cars-changed", refresh);
    const i = setInterval(refresh, 3000);
    return () => {
      window.removeEventListener("topcar:cars-changed", refresh);
      clearInterval(i);
    };
  }, [id]);

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-24 text-center">
          <p className="text-muted-foreground">Veículo não encontrado.</p>
          <Button className="mt-6" onClick={() => navigate("/")}>Voltar</Button>
        </div>
      </div>
    );
  }

  const status = statusOf(car);
  const bid = currentBid(car);
  const minNext = nextMinBid(car);
  const target = status === "upcoming" ? car.startAt : car.endAt;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = Number(amount.replace(/\D/g, ""));
    if (!v) return toast.error("Informe um valor.");
    const res = placeBid(car.id, bidder || "Anônimo", v);
    if (res.ok) {
      toast.success(res.message);
      setAmount("");
    } else toast.error(res.message);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <Link to="/#catalogo" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
              <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full aspect-[16/10] object-cover" />
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={status} />
                <span className="text-xs text-muted-foreground">Placa final: •••• {car.plateEnd}</span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                {car.brand} {car.model} <span className="text-muted-foreground font-normal">{car.year}</span>
              </h1>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-card-gradient p-5 sm:grid-cols-3">
              <Spec icon={Gauge} label="Quilometragem" value={formatKm(car.mileage)} />
              <Spec icon={Palette} label="Cor" value={car.color} />
              <Spec icon={Fuel} label="Combustível" value={car.fuel} />
              <Spec icon={Cog} label="Câmbio" value={car.gearbox} />
              <Spec icon={CarIcon} label="Motorização" value={car.engine} />
              <Spec icon={Cog} label="Transmissão" value={car.transmission} />
              <Spec icon={CarIcon} label="Tipo" value={car.type} />
              <Spec icon={Hash} label="Portas" value={String(car.doors)} />
              <Spec icon={Hash} label="Final da placa" value={car.plateEnd} />
            </div>

            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold">Histórico de lances</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-border/60">
                {car.bids.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">Nenhum lance ainda. Seja o primeiro!</div>
                ) : (
                  <ul className="divide-y divide-border">
                    {[...car.bids].sort((a, b) => b.amount - a.amount).map((b) => (
                      <li key={b.id} className="flex items-center justify-between bg-card/60 px-5 py-3">
                        <div>
                          <p className="text-sm font-medium">{b.bidder}</p>
                          <p className="text-xs text-muted-foreground">{new Date(b.at).toLocaleString("pt-BR")}</p>
                        </div>
                        <p className="font-display font-semibold text-gold">{formatBRL(b.amount)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* sidebar */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24 space-y-5">
              <div className="rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-card">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Lance atual</p>
                <p className="font-display text-4xl font-bold text-gold">{formatBRL(bid)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Próximo lance mínimo: <span className="font-semibold text-foreground">{formatBRL(minNext)}</span>
                  <span className="ml-2">(+ {formatBRL(car.minIncrement)})</span>
                </p>

                <div className="mt-5 rounded-xl border border-border/60 bg-background/50 p-4">
                  <CountdownBlock target={target} status={status} />
                </div>

                {status === "live" ? (
                  <form onSubmit={submit} className="mt-5 space-y-3">
                    <Input
                      placeholder="Seu nome"
                      value={bidder}
                      onChange={(e) => setBidder(e.target.value)}
                    />
                    <Input
                      placeholder={`Mínimo ${formatBRL(minNext)}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      inputMode="numeric"
                    />
                    <Button type="submit" variant="hero" className="w-full h-12">
                      <Gavel className="mr-2 h-4 w-4" /> Dar lance
                    </Button>
                  </form>
                ) : (
                  <div className="mt-5 rounded-xl bg-muted/40 p-4 text-center text-sm text-muted-foreground">
                    {status === "upcoming" ? "Aguardando início do leilão." : "Leilão encerrado."}
                  </div>
                )}
              </div>

              <Button asChild variant="whatsapp" className="w-full h-12">
                <a href={WHATS} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Falar no WhatsApp
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Spec({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "live" | "upcoming" | "ended" }) {
  if (status === "live")
    return <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/30">AO VIVO</span>;
  if (status === "upcoming")
    return <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold ring-1 ring-gold/30">EM BREVE</span>;
  return <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-border">ENCERRADO</span>;
}

function CountdownBlock({ target, status }: { target: string; status: "live" | "upcoming" | "ended" }) {
  const { d, h, m, s, done } = useCountdown(target);
  if (status === "ended" || done) return <p className="text-center text-sm text-muted-foreground">Leilão encerrado</p>;
  const label = status === "upcoming" ? "Inicia em" : "Encerra em";
  const cells = [
    { v: d, l: "dias" },
    { v: h, l: "horas" },
    { v: m, l: "min" },
    { v: s, l: "seg" },
  ];
  return (
    <>
      <p className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        <Clock className="h-3.5 w-3.5 text-gold" /> {label}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center">
        {cells.map((c) => (
          <div key={c.l} className="rounded-lg bg-background/80 py-2 ring-1 ring-border">
            <p className="font-display text-xl font-bold tabular-nums text-gold">{String(c.v).padStart(2, "0")}</p>
            <p className="text-[10px] uppercase text-muted-foreground">{c.l}</p>
          </div>
        ))}
      </div>
    </>
  );
}
