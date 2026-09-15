import { ArrowLeftRight, BarChart3, Home, Share2, Trophy } from "lucide-react";
import { useEffect, useLayoutEffect } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "sonner";
import { useLeagueQuery } from "@/hooks";
import { saveLeague } from "@/saved-leagues";
import { BrandMark } from "./BrandMark";
import { Button } from "./ui/button";

const nav = [
  ["overview", "Main", Home],
  ["transfers", "Transfers", ArrowLeftRight],
  ["standings", "Standings", Trophy],
  ["values", "Values", BarChart3],
] as const;

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Local-network HTTP pages cannot use the modern Clipboard API.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.readOnly = true;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, value.length);
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Clipboard copy was rejected");
}

export function AppShell() {
  const { leagueId = "" } = useParams();
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const league = useLeagueQuery(leagueId).data;

  useEffect(() => {
    if (!league) return;
    saveLeague({ id: league.league.id, name: league.league.name });
  }, [league]);

  useLayoutEffect(() => {
    // ManagerDetail sets a more useful mobile position once its data is ready.
    if (routeLocation.pathname.includes("/managers/")) return;
    window.scrollTo({ top: 0 });
  }, [routeLocation.pathname]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    const edgeSize = 28;
    const minimumDistance = 72;
    let gesture:
      | { edge: "left" | "right"; pointerId: number; x: number; y: number }
      | undefined;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;

      const edge =
        event.clientX <= edgeSize
          ? "left"
          : event.clientX >= window.innerWidth - edgeSize
            ? "right"
            : undefined;
      gesture = edge
        ? {
            edge,
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          }
        : undefined;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!gesture || event.pointerId !== gesture.pointerId) return;

      const deltaX = event.clientX - gesture.x;
      const deltaY = event.clientY - gesture.y;
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.25;
      const directionMatches =
        (gesture.edge === "left" && deltaX >= minimumDistance) ||
        (gesture.edge === "right" && deltaX <= -minimumDistance);
      const edge = gesture.edge;
      gesture = undefined;

      if (!isHorizontal || !directionMatches) return;
      navigate(edge === "left" ? -1 : 1);
    };

    const cancelGesture = () => {
      gesture = undefined;
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", cancelGesture);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", cancelGesture);
    };
  }, [navigate]);

  const copy = async () => {
    try {
      await copyText(`${location.origin}/league/${leagueId}/overview`);
      toast.success("League link copied");
    } catch {
      toast.error("Couldn’t copy the league link");
    }
  };

  return (
    <div className="league-shell min-h-screen pb-24 md:pb-10">
      <div className="overview-backdrop" aria-hidden="true" />
      <header className="league-header fixed inset-x-0 top-0 z-40">
        <div className="league-header__inner mx-auto flex max-w-6xl items-center gap-3 px-5 sm:px-6">
          <button aria-label="Choose another league" onClick={() => navigate("/")} className="flex min-w-0 shrink items-center gap-2.5 text-left tracking-tight text-[#cdd6f4]">
            <BrandMark className="league-header__mark size-10 shrink-0" />
            <span className="min-w-0 leading-tight">
              <span className="league-header__title block truncate font-black">FPL Basket</span>
              <span className="league-header__league block max-w-36 truncate font-medium text-[#a6adc8] sm:max-w-52">{league?.league.name ?? "Loading league…"}</span>
            </span>
          </button>
          <nav className="league-desktop-nav ml-4 hidden items-center gap-1 p-1 md:flex">
            {nav.map(([path, label, Icon]) => (
              <NavLink key={path} to={`/league/${leagueId}/${path}`} className={({ isActive }) => `league-nav-link ${isActive ? "is-active" : ""}`}>
                <Icon className="size-4" />{label}
              </NavLink>
            ))}
          </nav>
          <div className="league-header__event ml-auto flex shrink-0 items-center gap-2 font-bold text-[#cdd6f4]"><span className="size-2 rounded-full bg-[#94e2d5] shadow-[0_0_12px_rgba(148,226,213,.65)]" />{league ? `GW ${league.event.id}` : "GW"}</div>
          <Button aria-label="Copy league link" variant="ghost" size="icon" onClick={copy} className="league-header__share text-[#b4befe] hover:bg-[#313244]/60 hover:text-[#cdd6f4]"><Share2 /></Button>
        </div>
      </header>
      <main className="league-main mx-auto max-w-7xl px-4 pt-24 sm:px-6"><Outlet /></main>
      <nav aria-label="Main navigation" className="league-bottom-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 p-1.5 md:hidden">
        {nav.map(([path, label, Icon]) => (
          <NavLink key={path} to={`/league/${leagueId}/${path}`} className={({ isActive }) => `league-mobile-nav-link ${isActive ? "is-active" : ""}`}>
            <Icon className="size-5" />{label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
