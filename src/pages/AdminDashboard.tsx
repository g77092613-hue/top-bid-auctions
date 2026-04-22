import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo-topcar.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { isAdmin, logout } from "@/lib/auth";
import { Car, currentBid, deleteCar, formatBRL, loadCars, statusOf, upsertCar } from "@/lib/auctions";
import { Plus, Pencil, Trash2, LogOut, ExternalLink, Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";

const empty = (): Car => ({
  id: Math.random().toString(36).slice(2, 10),
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  image: "",
  images: [],
  mileage: 0,
  color: "",
  fuel: "Flex",
  gearbox: "Automático",
  engine: "",
  transmission: "Dianteira",
  type: "Sedan",
  doors: 4,
  plateEnd: "",
  startBid: 0,
  minIncrement: 500,
  startAt: new Date().toISOString().slice(0, 16),
  endAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  bids: [],
});

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const tz = d.getTimezoneOffset();
  return new Date(d.getTime() - tz * 60000).toISOString().slice(0, 16);
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [editing, setEditing] = useState<Car | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/admin/login");
      return;
    }
    const refresh = () => setCars(loadCars());
    refresh();
    window.addEventListener("topcar:cars-changed", refresh);
    return () => window.removeEventListener("topcar:cars-changed", refresh);
  }, [navigate]);

  const openNew = () => { setEditing(empty()); setOpen(true); };
  const openEdit = (c: Car) => {
    setEditing({ ...c, startAt: toLocalInput(c.startAt), endAt: toLocalInput(c.endAt) });
    setOpen(true);
  };

  const save = () => {
    if (!editing) return;
    if (!editing.brand || !editing.model) return toast.error("Preencha marca e modelo.");
    const gallery = (editing.images ?? []).filter(Boolean);
    const cover = editing.image || gallery[0] || "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80";
    const car: Car = {
      ...editing,
      startAt: new Date(editing.startAt).toISOString(),
      endAt: new Date(editing.endAt).toISOString(),
      image: cover,
      images: gallery.length ? gallery : [cover],
    };
    upsertCar(car);
    toast.success("Veículo salvo.");
    setOpen(false);
    setEditing(null);
  };

  const remove = (id: string) => {
    deleteCar(id);
    toast.success("Veículo removido.");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="TopCar" className="h-12 w-auto" />
            <span className="hidden text-sm font-semibold text-gold md:inline">Painel Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/"><ExternalLink className="mr-2 h-4 w-4" /> Ver site</Link>
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Gestão de veículos</h1>
            <p className="text-sm text-muted-foreground">{cars.length} veículo(s) cadastrado(s)</p>
          </div>
          <Button variant="hero" onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Novo veículo</Button>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Veículo</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Lance atual</th>
                  <th className="px-4 py-3">Encerramento</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cars.length === 0 && (
                  <tr><td colSpan={5} className="p-10 text-center text-muted-foreground">Nenhum veículo cadastrado.</td></tr>
                )}
                {cars.map((c) => {
                  const st = statusOf(c);
                  return (
                    <tr key={c.id} className="hover:bg-secondary/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={c.image} alt="" className="h-10 w-14 rounded object-cover" />
                          <div>
                            <p className="font-medium">{c.brand} {c.model}</p>
                            <p className="text-xs text-muted-foreground">{c.year} · {c.type} · {c.color}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={
                          st === "live" ? "rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary"
                          : st === "upcoming" ? "rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold"
                          : "rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                        }>
                          {st === "live" ? "AO VIVO" : st === "upcoming" ? "EM BREVE" : "ENCERRADO"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gold">{formatBRL(currentBid(c))}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(c.endAt).toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover veículo?</AlertDialogTitle>
                                <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => remove(c.id)} className="bg-destructive hover:bg-destructive/90">Remover</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing && cars.find((c) => c.id === editing.id) ? "Editar veículo" : "Novo veículo"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Marca" value={editing.brand} onChange={(v) => setEditing({ ...editing, brand: v })} />
              <Field label="Modelo" value={editing.model} onChange={(v) => setEditing({ ...editing, model: v })} />
              <Field label="Ano" type="number" value={String(editing.year)} onChange={(v) => setEditing({ ...editing, year: Number(v) })} />
              <Field label="Quilometragem" type="number" value={String(editing.mileage)} onChange={(v) => setEditing({ ...editing, mileage: Number(v) })} />
              <Field label="Cor" value={editing.color} onChange={(v) => setEditing({ ...editing, color: v })} />
              <Field label="Combustível" value={editing.fuel} onChange={(v) => setEditing({ ...editing, fuel: v })} />
              <Field label="Câmbio" value={editing.gearbox} onChange={(v) => setEditing({ ...editing, gearbox: v })} />
              <Field label="Motorização" value={editing.engine} onChange={(v) => setEditing({ ...editing, engine: v })} />
              <Field label="Transmissão" value={editing.transmission} onChange={(v) => setEditing({ ...editing, transmission: v })} />
              <Field label="Tipo (SUV, Sedan...)" value={editing.type} onChange={(v) => setEditing({ ...editing, type: v })} />
              <Field label="Número de portas" type="number" value={String(editing.doors)} onChange={(v) => setEditing({ ...editing, doors: Number(v) })} />
              <Field label="Final da placa (4 dígitos)" value={editing.plateEnd} onChange={(v) => setEditing({ ...editing, plateEnd: v })} />
              <Field label="Lance inicial (R$)" type="number" value={String(editing.startBid)} onChange={(v) => setEditing({ ...editing, startBid: Number(v) })} />
              <Field label="Incremento mínimo (R$)" type="number" value={String(editing.minIncrement)} onChange={(v) => setEditing({ ...editing, minIncrement: Number(v) })} />
              <Field label="Início do leilão" type="datetime-local" value={editing.startAt} onChange={(v) => setEditing({ ...editing, startAt: v })} />
              <Field label="Encerramento" type="datetime-local" value={editing.endAt} onChange={(v) => setEditing({ ...editing, endAt: v })} />

              <div className="sm:col-span-2">
                <GalleryField
                  images={editing.images ?? (editing.image ? [editing.image] : [])}
                  onChange={(imgs) => setEditing({ ...editing, images: imgs, image: imgs[0] ?? "" })}
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button variant="hero" onClick={save}>Salvar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function GalleryField({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const [url, setUrl] = useState("");

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((results) => onChange([...images, ...results]));
  };

  const addUrl = () => {
    if (!url.trim()) return;
    onChange([...images, url.trim()]);
    setUrl("");
  };

  const removeAt = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-background/40 p-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-gold" />
        <Label className="text-xs font-semibold uppercase tracking-wider">
          Galeria de imagens {images.length > 0 && <span className="text-muted-foreground">({images.length})</span>}
        </Label>
      </div>
      <p className="text-xs text-muted-foreground">A primeira imagem será usada como capa do veículo.</p>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
              <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-gold/90 px-1.5 py-0.5 text-[10px] font-bold text-background">
                  CAPA
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 rounded-full bg-destructive/90 p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remover"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background/50 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
          <Upload className="h-4 w-4" />
          Enviar fotos do dispositivo
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Ou cole uma URL de imagem"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addUrl}>
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}
