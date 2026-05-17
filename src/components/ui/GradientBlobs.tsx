export function GradientBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
      <div className="absolute top-20 -right-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[oklch(0.55_0.18_280/0.2)] blur-3xl" />
    </div>
  );
}
