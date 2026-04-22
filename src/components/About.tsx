import { ShieldCheck, Award, Users, Gavel } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Confiança",
    desc: "Veículos 100% verificados e documentação revisada antes de cada leilão.",
  },
  {
    icon: Gavel,
    title: "Transparência",
    desc: "Lances públicos e histórico completo acessível a todos os participantes.",
  },
  {
    icon: Award,
    title: "Qualidade",
    desc: "Curadoria criteriosa para oferecer apenas oportunidades reais.",
  },
  {
    icon: Users,
    title: "Atendimento",
    desc: "Suporte humano e direto pelo WhatsApp, do primeiro lance à entrega.",
  },
];

export default function About() {
  return (
    <section id="sobre" className="border-t border-border/60 bg-card/30 py-20">
      <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary ring-1 ring-primary/20">
            Sobre nós
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
            A <span className="text-primary">TopCar Leilões</span> conecta você ao carro certo
          </h2>
          <p className="mt-4 text-muted-foreground">
            Somos especialistas em leilões automotivos com foco em procedência, segurança e
            oportunidades reais. Cada veículo passa por inspeção e tem seus dados abertos para que
            você dê o seu lance com total tranquilidade.
          </p>
          <p className="mt-3 text-muted-foreground">
            Mais de uma década ajudando compradores e vendedores a fecharem os melhores negócios
            com agilidade e transparência.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <div
              key={v.title}
              className="group rounded-2xl border border-border/60 bg-card-gradient p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
