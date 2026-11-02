export function SectionLabel({ index, children, className = "" }: { index?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      <span aria-hidden className="relative flex size-2">
        <span className="absolute inset-0 rounded-full bg-current opacity-30 motion-safe:animate-ping" />
        <span className="relative size-2 rounded-full bg-current" />
      </span>
      {index && <span className="opacity-50">{index}</span>}
      <span>{children}</span>
    </p>
  );
}
