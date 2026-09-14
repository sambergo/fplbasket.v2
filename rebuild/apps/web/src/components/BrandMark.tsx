export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 44 44" role="img" aria-label="FPL Basket logo">
      <defs>
        <linearGradient id="basket-mark" x1="5" y1="4" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#89b4fa" />
          <stop offset="1" stopColor="#cba6f7" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="11.5" r="7.5" fill="none" stroke="url(#basket-mark)" strokeWidth="3" />
      <path d="m17.8 6.2 1.3 3.2-2.7 2m9.8-5.2-1.3 3.2 2.7 2M19 17l3-2 3 2" fill="none" stroke="url(#basket-mark)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M7 21.5h30l-4.2 15H11.2L7 21.5Z" fill="none" stroke="url(#basket-mark)" strokeLinejoin="round" strokeWidth="3" />
      <path d="M12 27h20M15 32h14" stroke="url(#basket-mark)" strokeLinecap="round" strokeWidth="2.4" />
    </svg>
  );
}
