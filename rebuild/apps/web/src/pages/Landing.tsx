import { ArrowRight, Link2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState, type PointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorPanel } from "@/components/common";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContextQuery } from "@/hooks";

const reveal = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } };

export function Landing() {
  const navigate = useNavigate();
  const context = useContextQuery();
  const reduceMotion = useReducedMotion();
  const [leagueId, setLeagueId] = useState(() => localStorage.getItem("fpl-basket:last-league") ?? "");
  const [validationError, setValidationError] = useState("");

  if (context.error) return <main className="mx-auto grid min-h-screen max-w-xl place-items-center px-5"><ErrorPanel error={context.error} retry={() => context.refetch()} /></main>;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = leagueId.trim();
    if (!/^\d+$/.test(value) || Number(value) < 1) {
      setValidationError("Enter a valid numeric league ID.");
      return;
    }
    setValidationError("");
    localStorage.setItem("fpl-basket:last-league", value);
    navigate(`/league/${value}/overview`);
  };

  const moveScene = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty("--scene-x", `${x * -8}px`);
    event.currentTarget.style.setProperty("--scene-y", `${y * -5}px`);
  };

  return (
    <main className="landing" onPointerMove={moveScene}>
      <div className="landing__scene" aria-hidden="true" />
      <div className="landing__shade" aria-hidden="true" />

      <header className="landing__header">
        <a className="landing__brand" href="/" aria-label="FPL Basket home"><BrandMark className="landing__brand-mark" /><span>FPL Basket</span></a>
        <div className="landing__event" aria-live="polite"><span className="landing__event-dot" />{context.data ? context.data.currentEvent.name : "Finding gameweek…"}</div>
      </header>

      <motion.section id="home" className="landing__content" initial={reduceMotion ? false : "hidden"} animate="visible" transition={{ staggerChildren: 0.1, delayChildren: 0.08 }}>
        <motion.form variants={reveal} transition={{ duration: 0.6 }} onSubmit={submit} className="landing__form" noValidate>
          <div className="landing__input-wrap">
            <Link2 aria-hidden="true" />
            <label htmlFor="league-id" className="sr-only">League ID</label>
            <Input id="league-id" inputMode="numeric" pattern="[0-9]+" required value={leagueId} onChange={(event) => { setLeagueId(event.target.value); setValidationError(""); }} placeholder="League ID" aria-invalid={Boolean(validationError)} aria-describedby={validationError ? "league-id-error" : undefined} className="landing__input" />
          </div>
          <Button size="lg" className="landing__submit">View league <ArrowRight /></Button>
          {validationError && <p id="league-id-error" className="landing__form-error" role="alert">{validationError}</p>}
        </motion.form>
      </motion.section>
    </main>
  );
}
