import { CircleHelp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState, type PointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const reveal = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } };

export function Landing() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [leagueId, setLeagueId] = useState(() => localStorage.getItem("fpl-basket:last-league") ?? "");
  const [showLeagueIdHelp, setShowLeagueIdHelp] = useState(false);
  const [validationError, setValidationError] = useState("");

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

      <motion.section id="home" className="landing__content" initial={reduceMotion ? false : "hidden"} animate="visible" transition={{ staggerChildren: 0.1, delayChildren: 0.08 }}>
        <motion.form variants={reveal} transition={{ duration: 0.6 }} onSubmit={submit} className="landing__form" noValidate>
          <div className="landing__input-wrap">
            <label htmlFor="league-id" className="landing__input-label">League ID</label>
            <Input id="league-id" inputMode="numeric" pattern="[0-9]+" required value={leagueId} onChange={(event) => { setLeagueId(event.target.value); setValidationError(""); }} aria-invalid={Boolean(validationError)} aria-describedby={[showLeagueIdHelp ? "league-id-help" : "", validationError ? "league-id-error" : ""].filter(Boolean).join(" ") || undefined} className="landing__input" />
            <button className="landing__input-help" type="button" aria-label="Where to find your league ID" aria-expanded={showLeagueIdHelp} onClick={() => setShowLeagueIdHelp((visible) => !visible)}>
              <CircleHelp aria-hidden="true" />
            </button>
            {showLeagueIdHelp && <p id="league-id-help" className="landing__help-copy">Use the number in your FPL league standings URL.</p>}
          </div>
          <Button size="lg" className="landing__submit">GO!</Button>
          {validationError && <p id="league-id-error" className="landing__form-error" role="alert">{validationError}</p>}
        </motion.form>
      </motion.section>
    </main>
  );
}
