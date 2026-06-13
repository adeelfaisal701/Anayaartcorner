import { Container } from "./container";

const footerLinks = ["Privacy", "Terms", "Instagram"];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-secondary/30">
      <Container className="flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {year} Anaya Art Gallery. All rights reserved.
        </p>

        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <span
              key={link}
              className="cursor-default text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link}
            </span>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
