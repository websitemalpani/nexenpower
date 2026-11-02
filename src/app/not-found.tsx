import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-ink text-paper">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_60%,rgba(11,147,147,.25),transparent_70%)]" />
      <div className="container-x relative pt-24">
        <p className="eyebrow text-mint">Error 404 · Off-grid</p>
        <h1 className="display mt-6 type-h1">
          This line isn’t <span className="accent text-mint">connected.</span>
        </h1>
        <p className="mt-6 max-w-md text-paper/65">The page you’re looking for has moved or doesn’t exist.</p>
        <div className="mt-10">
          <Button href="/" variant="light">
            Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}
