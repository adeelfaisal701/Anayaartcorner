import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { artworks } from "@/lib/home/data";
import {
  ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  NAV_SECTIONS,
  WHATSAPP_URL,
  WHATSAPP_NUMBER,
} from "@/lib/home/constants";

function BrandLogo() {
  return (
    <svg
      viewBox="0 0 120 52"
      xmlns="http://www.w3.org/2000/svg"
      width="180"
      height="52"
      aria-hidden
    >
      <path
        d="M22 10 A16 16 0 1 0 22 42 A11 11 0 1 1 22 10Z"
        fill="none"
        stroke="#C8962A"
        strokeWidth="1.8"
      />
      <line
        x1="34"
        y1="8"
        x2="14"
        y2="44"
        stroke="#C8962A"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M34 8 Q30 20 22 32 Q18 38 14 44"
        fill="none"
        stroke="#C8962A"
        strokeWidth="1"
        opacity="0.55"
      />
      <path
        d="M14 44 Q20 36 28 22 Q32 14 34 8"
        fill="none"
        stroke="#C8962A"
        strokeWidth="0.9"
        opacity="0.35"
      />
      <circle cx="14" cy="44" r="1.6" fill="#C8962A" />
      <line x1="48" y1="10" x2="48" y2="42" stroke="#C8962A" strokeWidth="0.8" opacity="0.4" />
      <text
        x="56"
        y="28"
        fontFamily="'Dancing Script', cursive"
        fontSize="22"
        fill="#1a1008"
        fontWeight="700"
      >
        Anaya
      </text>
      <text
        x="57"
        y="39"
        fontFamily="Inter, sans-serif"
        fontSize="7"
        fill="#C8962A"
        fontWeight="600"
        letterSpacing="3"
      >
        ART CORNER
      </text>
    </svg>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for the product page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const products = artworks.map((art) => ({
    ...art,
    id:
      art.id ||
      art.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
  }));

  const product = products.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} — Handcrafted Portrait & Painting`,
    description: `Order "${product.name}", a beautiful handcrafted ${product.medium} painting at Anaya Art Corner. Custom sizes, premium framing, and secure nationwide delivery available.`,
    openGraph: {
      title: `${product.name} | Anaya Art Corner`,
      description: `Handcrafted ${product.medium} painting. Custom options available.`,
      images: [
        {
          url: product.image,
          alt: product.name,
        },
      ],
    },
  };
}

// Pre-render dynamic routes
export async function generateStaticParams() {
  return artworks.map((art) => ({
    id:
      art.id ||
      art.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
  }));
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  const products = artworks.map((art) => ({
    ...art,
    id:
      art.id ||
      art.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
  }));

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Pre-fill a WhatsApp message for ordering this product
  const encodedMsg = encodeURIComponent(
    `Hi Anaya Art Corner! I am interested in ordering the custom artwork: "${product.name}" (${product.medium}). Can you please guide me on pricing, framing, and delivery options?`,
  );
  const waProductUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

  return (
    <>
      {/* Header Nav */}
      <nav id="navbar" className="scrolled" style={{ position: "sticky", top: 0 }}>
        <Link className="logo" href="/">
          <BrandLogo />
        </Link>
        <ul className="nav-links">
          {NAV_SECTIONS.map(({ id: navId, label }) => (
            <li key={navId}>
              <Link
                href={navId === "hero" ? "/" : navId === "reviews" ? "/reviews" : `/#${navId}`}
                className={navId === "featured" ? "active" : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nav-wa">
            WhatsApp
          </a>
        </div>
      </nav>

      {/* Main Details Container */}
      <main
        style={{
          minHeight: "80vh",
          background: "var(--cream)",
          padding: "clamp(32px, 6vw, 64px) clamp(12px, 3vw, 20px)",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* Breadcrumbs */}
          <div
            style={{ marginBottom: "28px", fontSize: "0.85rem", color: "var(--muted-foreground)" }}
          >
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              Home
            </Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <Link href="/shop" style={{ color: "inherit", textDecoration: "none" }}>
              Shop
            </Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--gold)", fontWeight: 500 }}>{product.name}</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
              gap: "clamp(24px, 5vw, 48px)",
              background: "white",
              padding: "clamp(16px, 5vw, 40px)",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Image Wrap */}
            <div
              style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid var(--border)",
                height: "fit-content",
              }}
            >
              <Image
                src={product.image}
                alt={product.name}
                width={800}
                height={600}
                style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                priority
              />
              {product.badge && (
                <span className="art-badge" style={{ top: "16px", left: "16px" }}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Product Meta Details */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span
                style={{
                  color: "var(--gold)",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                Handcrafted Masterpiece
              </span>

              <h1
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "2.2rem",
                  fontWeight: 600,
                  color: "var(--color-accent)",
                  lineHeight: "1.2",
                  marginBottom: "12px",
                }}
              >
                {product.name}
              </h1>

              <div
                style={{
                  fontSize: "0.95rem",
                  color: "var(--muted-foreground)",
                  marginBottom: "24px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <strong>Medium:</strong> {product.medium}
              </div>

              {/* Price Details */}
              <div style={{ marginBottom: "28px" }}>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--muted-foreground)",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Est. Price
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                  }}
                >
                  {product.price}
                </span>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--muted-foreground)",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  *Prices vary based on portrait sizing and framing preferences.
                </span>
              </div>

              {/* Description & Ordering info */}
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  color: "#4a4a4a",
                  marginBottom: "32px",
                }}
              >
                Every single portrait at Anaya Art Corner is meticulously sketched or painted by
                hand using professional artist-grade materials. Whether you want to purchase this
                exact piece or customize your own copy with personalized dimensions and framing, we
                deliver nationwide to your doorstep with white-glove packaging.
              </p>

              {/* CTA buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                <a
                  href={waProductUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 28px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    background: "var(--gold)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(200, 150, 42, 0.3)",
                    transition: "all 0.2s",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                    style={{ flexShrink: 0 }}
                  >
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.99L2 22l5.233-1.371a9.95 9.95 0 0 0 4.773 1.226h.005c5.505 0 9.989-4.478 9.99-9.984a9.96 9.96 0 0 0-9.99-9.871zM17.91 16.92c-.247.697-1.432 1.353-1.964 1.41-.497.054-.99.256-3.15-.595-2.76-1.088-4.52-3.896-4.66-4.083-.136-.187-1.12-1.488-1.12-2.837 0-1.35.704-2.012.955-2.274.25-.262.548-.328.73-.328h.525c.168 0 .393-.063.612.463.225.538.77 1.875.836 2.007.067.13.113.28.023.463-.09.18-.135.293-.27.452-.135.158-.285.353-.405.474-.136.136-.28.285-.12.563.16.27.708 1.168 1.517 1.888.66.586 1.217.8 1.554.94.338.14.538.12.74-.11.2-.23.87-1.01.11-1.352-.15-.067-.25-.11-.42-.19s-.35-.165-.48-.223c-.13-.058-.21-.09-.3-.023-.09.066-.38.484-.46.586-.08.102-.167.113-.317.037-.15-.075-.63-.232-1.202-.743-.445-.397-.745-.887-.833-1.036-.087-.15-.01-.23.066-.305.068-.067.15-.175.226-.263a1.44 1.44 0 0 0 .15-.25c.068-.135.034-.25-.017-.35-.05-.1-.462-1.114-.633-1.523-.166-.398-.334-.344-.46-.35-.12-.007-.258-.007-.393-.007-.135 0-.356.05-.543.256-.187.206-.713.693-.713 1.693 0 1 .73 1.969.83 2.106.1.137 1.438 2.196 3.483 3.08.487.21.867.336 1.162.43.49.156.936.134 1.29.08.393-.06 1.2-.49 1.37-1.026.17-.537.17-.997.12-1.093-.05-.096-.18-.15-.38-.25z" />
                  </svg>
                  Order on WhatsApp
                </a>
                <Link
                  href="/shop"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 28px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    background: "transparent",
                    color: "var(--accent)",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Back to Shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: "var(--dark2)", padding: "52px 60px 0" }}>
        <div className="ft-grid">
          <div className="ft-brand">
            <div className="n" style={{ color: "white" }}>
              Anaya
            </div>
            <div className="s" style={{ color: "var(--gold)" }}>
              Art Corner
            </div>
            <p>
              We create timeless art that captures emotions and turns memories into masterpieces.
              Every piece is made with passion and love.
            </p>
          </div>
          <div className="ft-col">
            <h4>Quick Links</h4>
            <ul>
              {NAV_SECTIONS.map(({ id: navId, label }) => (
                <li key={navId}>
                  <Link
                    href={navId === "hero" ? "/" : navId === "reviews" ? "/reviews" : `/#${navId}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="ft-col">
            <h4>Services</h4>
            <ul>
              <li>
                <Link href="/#how">Custom Portraits</Link>
              </li>
              <li>
                <Link href="/#featured">Wildlife Art</Link>
              </li>
              <li>
                <Link href="/#featured">Wedding Portraits</Link>
              </li>
              <li>
                <Link href="/#featured">Islamic Calligraphy</Link>
              </li>
            </ul>
          </div>
          <div className="ft-col">
            <h4>Contact</h4>
            <ul>
              <li>{CONTACT_PHONE}</li>
              <li>{CONTACT_EMAIL}</li>
              <li style={{ fontSize: ".82rem", color: "rgba(255,255,255,.4)" }}>{ADDRESS}</li>
            </ul>
          </div>
        </div>
        <div className="ft-bot">
          <p>© 2024 Anaya Art Corner. All Rights Reserved.</p>
          <div className="ft-bot-links">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
