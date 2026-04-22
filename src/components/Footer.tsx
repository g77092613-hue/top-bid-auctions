import { Link } from "react-router-dom";
import logo from "@/assets/logo-topcar.png";
import { Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contato" className="border-t border-border/60 bg-card/40">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logo} alt="TopCar Leilões" className="h-16 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Transparência em cada lance, grandes oportunidades em cada leilão. A TopCar conecta você aos melhores veículos com segurança e confiança.
          </p>
        </div>

        <div id="sobre">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">Navegação</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/#catalogo" className="hover:text-foreground transition-colors">Catálogo</a></li>
            <li><a href="/#sobre" className="hover:text-foreground transition-colors">Sobre</a></li>
            <li><a href="/#contato" className="hover:text-foreground transition-colors">Contato</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">Atendimento</h4>
          <a href="https://wa.me/5511934516708" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
            <Phone className="h-4 w-4" /> (11) 93451-6708
          </a>
          <p className="mt-3 text-xs text-muted-foreground">Seg–Sáb · 8h às 19h</p>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} TopCar Leilões. Todos os direitos reservados.</p>
          <Link to="/admin/login" className="text-muted-foreground/40 hover:text-gold transition-colors" aria-label="Acesso administrativo">
            ·
          </Link>
        </div>
      </div>
    </footer>
  );
}
