export function GradientBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-accent/15 blur-[100px]" />
      <div className="absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
    </div>
  );
}
