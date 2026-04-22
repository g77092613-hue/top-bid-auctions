import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "@/assets/logo-topcar.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";
import { toast } from "sonner";
import { Lock, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (login(email, password)) {
        toast.success("Bem-vindo, administrador.");
        navigate("/admin");
      } else {
        toast.error("Credenciais inválidas.");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="flex min-h-screen flex-col bg-hero">
      <div className="container py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar ao site
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="flex justify-center">
            <img src={logo} alt="TopCar" className="h-20 w-auto" />
          </div>
          <div className="mt-6 rounded-2xl border border-border/60 bg-card-gradient p-8 shadow-elegant">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold">Painel Administrativo</h1>
                <p className="text-xs text-muted-foreground">Acesso restrito</p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
              </div>
              <Button type="submit" variant="hero" className="w-full h-12" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
