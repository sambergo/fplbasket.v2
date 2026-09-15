import { AlertTriangle, LoaderCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export function PageMotion({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <motion.div initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .22 }}>{children}</motion.div>;
}
export function LoadingPage() { return <div className="space-y-4"><Skeleton className="h-32" /><div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" /></div><Skeleton className="h-80" /></div>; }
export function ErrorPanel({ error, retry }: { error: Error; retry?: () => void }) { return <Card className="flex flex-col items-center gap-4 p-10 text-center"><span className="grid size-12 place-items-center rounded-2xl bg-rose-400/10 text-rose-300"><AlertTriangle /></span><div><h2 className="text-lg font-bold">Couldn’t load this view</h2><p className="mt-1 text-sm text-slate-400">{error.message}</p></div>{retry && <Button variant="outline" onClick={retry}>Try again</Button>}</Card>; }
export function Refreshing() { return <span className="inline-flex items-center gap-1.5 text-xs text-cyan-200"><LoaderCircle className="size-3 animate-spin" /> Updating</span>; }
export function Stat({ label, value, accent }: { label: string; value: ReactNode; accent?: string }) { return <Card className="p-5"><div className="text-xs font-semibold uppercase tracking-[.14em] text-slate-500">{label}</div><div className={accent ?? "mt-2 text-3xl font-black tracking-tight text-white"}>{value}</div></Card>; }
