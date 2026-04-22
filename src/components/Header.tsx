import { Link } from "react-router-dom";
import logo from "@/assets/logo-topcar.png";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";

const WHATS = "https://wa.me/5511934516708?text=Ol%C3%A1%21%20Tenho%20interesse%20em%20um%20leil%C3%A3o.";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="TopCar Leilões" className="h-14 w-auto drop-shadow-[0_4px_20px_hsl(var(--primary)/0.3)]" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="/#catalogo" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Catálogo</a>
          <a href="/#sobre" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Sobre</a>
          <a href="/#contato" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contato</a>
        </nav>

        <div className="hidden md:block">
          <Button asChild variant="whatsapp" size="sm">
            <a href={WHATS} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
            </a>
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="container flex flex-col gap-4 py-4">
            <a href="/#catalogo" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">Catálogo</a>
            <a href="/#sobre" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">Sobre</a>
            <a href="/#contato" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">Contato</a>
            <Button asChild variant="whatsapp" size="sm">
              <a href={WHATS} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
