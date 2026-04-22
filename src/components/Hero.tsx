import { Button } from "@/components/ui/button";
import { ShieldCheck, Gavel, Headset, MessageCircle } from "lucide-react";

const WHATS = "https://wa.me/5511934516708";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      {/* glow */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-wine/40 blur-3xl" />

      <div className="container relative py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-medium text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" /> Leilões ao vivo toda semana
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Os melhores carros,{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                pelo melhor lance
              </span>
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-primary to-transparent" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Veículos 100% verificados, lances transparentes e total suporte.
            Encontre oportunidades únicas e dispute em tempo real na TopCar Leilões.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="hero" className="h-12 px-8">
              <a href="#catalogo">Ver catálogo</a>
            </Button>
            <Button asChild size="lg" variant="heroOutline" className="h-12 px-8">
              <a href={WHATS} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" /> Falar no WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* benefícios */}
        <div className="mx-auto mt-20 grid max-w-4xl gap-4 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "100% verificados", desc: "Procedência e vistoria em cada veículo" },
            { icon: Gavel, title: "Lances transparentes", desc: "Histórico em tempo real, sem surpresas" },
            { icon: Headset, title: "Suporte direto", desc: "Fale com um especialista no WhatsApp" },
          ].map((b) => (
            <div
              key={b.title}
              className="group rounded-2xl border border-border/60 bg-card-gradient p-6 shadow-card transition-all hover:border-gold/40 hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-gold/10 group-hover:text-gold group-hover:ring-gold/30">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
