import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex flex-col leading-none", className)}>
      <span className="font-serif text-xl font-semibold tracking-wide text-foreground">Anaya</span>
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Art Gallery
      </span>
    </div>
  );
}
