"use client";

import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Container } from "./container";

const navItems = ["Gallery", "Portraits", "About", "Contact"];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <span
              key={item}
              className="cursor-default text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </span>
          ))}
        </nav>

        <ThemeToggle />
      </Container>
    </header>
  );
}
