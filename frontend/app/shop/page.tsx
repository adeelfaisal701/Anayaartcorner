"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { OrderModal } from "@/components/home/order-modal";
import { Toast } from "@/components/home/toast";
import {
  ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  NAV_SECTIONS,
  WHATSAPP_URL,
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

interface Product {
  id: string;
  name: string;
  medium: string;
  price: string;
  badge: string;
  image: string;
}

export default function ShopPage() {
  const router = useRouter();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedium, setSelectedMedium] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");

  // Order Modal state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState("");

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Fix potential response mapping issues (handles data, data.products, products, and direct array)
      const productsData =
        data.products || data.data?.products || data.data || (Array.isArray(data) ? data : null);

      if (productsData && Array.isArray(productsData)) {
        setProductsList(productsData);
      } else {
        setProductsList([]);
        setError("Invalid response format: Product list not found.");
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError((err as Error)?.message || "Failed to load products from server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // Extract unique mediums for filters
  const uniqueMediums = useMemo(() => {
    if (!productsList || !Array.isArray(productsList)) return [];
    const mediums = new Set<string>();
    productsList.forEach((p) => {
      if (p.medium) {
        // Group similar mediums to keep filter list clean
        if (p.medium.includes("Oil")) mediums.add("Oil on Canvas");
        else if (p.medium.includes("Color Pencil")) mediums.add("Color Pencil");
        else if (p.medium.includes("Diorama") || p.medium.includes("Resin"))
          mediums.add("Diorama & Crafts");
        else mediums.add(p.medium);
      }
    });
    return Array.from(mediums);
  }, [productsList]);

  // Handle open order modal
  const handleOpenOrderModal = (productName: string) => {
    setSelectedProductForOrder(`Order: ${productName}`);
    setOrderModalOpen(true);
  };

  // Helper to parse numeric price for sorting
  const parsePrice = (priceStr: string): number => {
    const cleanStr = priceStr.replace(/[^0-9]/g, "");
    const price = parseInt(cleanStr, 10);
    return isNaN(price) ? 0 : price;
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    if (!productsList || !Array.isArray(productsList)) return [];

    return productsList
      .filter((product) => {
        // Search filter
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.medium.toLowerCase().includes(searchQuery.toLowerCase());

        // Medium filter
        let matchesMedium = true;
        if (selectedMedium !== "all") {
          if (selectedMedium === "Oil on Canvas") {
            matchesMedium = product.medium.includes("Oil");
          } else if (selectedMedium === "Color Pencil") {
            matchesMedium = product.medium.includes("Color Pencil");
          } else if (selectedMedium === "Diorama & Crafts") {
            matchesMedium = product.medium.includes("Diorama") || product.medium.includes("Resin");
          } else {
            matchesMedium = product.medium === selectedMedium;
          }
        }

        return matchesSearch && matchesMedium;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "price-asc") {
          return parsePrice(a.price) - parsePrice(b.price);
        }
        if (sortBy === "price-desc") {
          return parsePrice(b.price) - parsePrice(a.price);
        }
        return 0;
      });
  }, [productsList, searchQuery, selectedMedium, sortBy]);

  return (
    <>
      {/* Header Nav */}
      <nav id="navbar" className="scrolled" style={{ position: "sticky", top: 0 }}>
        <Link className="logo" href="/">
          <BrandLogo />
        </Link>
        <ul className="nav-links">
          {NAV_SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <Link
                href={id === "hero" ? "/" : id === "reviews" ? "/reviews" : `/#${id}`}
                className={id === "featured" ? "active" : undefined}
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

      {/* Main Container */}
      <main style={{ minHeight: "80vh", background: "var(--cream)", padding: "48px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Section Head */}
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <p className="eyebrow">Our Gallery</p>
            <div className="divider-line">
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.5rem",
                  fontWeight: 600,
                }}
              >
                Shop Collection
              </h2>
            </div>
            <p style={{ marginTop: 8 }}>
              Explore our premium handcrafted paintings, sketches, and custom diorama art.
            </p>
          </div>

          {/* Filtering and Search Controls */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              border: "1px solid var(--border)",
              marginBottom: "32px",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Search Input */}
            <div style={{ display: "flex", flex: "1 1 300px", position: "relative" }}>
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-inter), sans-serif",
                  outline: "none",
                }}
              />
            </div>

            {/* Filter and Sort Options */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
              {/* Medium Filter */}
              <div className="rev-sort-group">
                <label htmlFor="medium-select">Medium: </label>
                <select
                  id="medium-select"
                  value={selectedMedium}
                  onChange={(e) => setSelectedMedium(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    fontSize: "0.85rem",
                    background: "white",
                  }}
                >
                  <option value="all">All Mediums</option>
                  {uniqueMediums.map((med) => (
                    <option key={med} value={med}>
                      {med}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sorting */}
              <div className="rev-sort-group">
                <label htmlFor="sort-select">Sort By: </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "name" | "price-asc" | "price-desc")}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    fontSize: "0.85rem",
                    background: "white",
                  }}
                >
                  <option value="name">Alphabetical</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid Area with safe rendering */}
          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--muted)",
                padding: "100px 0",
              }}
            >
              <LoadingSpinner size="lg" className="mb-4" />
              <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.95rem" }}>
                Loading products...
              </p>
            </div>
          ) : error ? (
            <div
              style={{
                textAlign: "center",
                background: "#fff5f5",
                border: "1px solid #feb2b2",
                padding: "40px 20px",
                borderRadius: "12px",
                maxWidth: "600px",
                margin: "60px auto",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="48"
                height="48"
                stroke="#f56565"
                strokeWidth="2"
                fill="none"
                style={{ margin: "0 auto 16px" }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3
                style={{
                  color: "#c53030",
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "1.3rem",
                  marginBottom: "8px",
                }}
              >
                Could Not Load Products
              </h3>
              <p style={{ color: "#742a2a", fontSize: "0.9rem" }}>{error}</p>
              <button
                type="button"
                className="btn-gold"
                onClick={fetchProducts}
                style={{ marginTop: "20px" }}
              >
                Try Again
              </button>
            </div>
          ) : !filteredProducts || filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                background: "white",
                border: "1px solid var(--border)",
                padding: "60px 20px",
                borderRadius: "12px",
                maxWidth: "600px",
                margin: "40px auto",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="48"
                height="48"
                stroke="var(--gold)"
                strokeWidth="2"
                fill="none"
                style={{ margin: "0 auto 16px" }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <h3
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontSize: "1.3rem",
                  marginBottom: "8px",
                }}
              >
                No Artworks Found
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                {
                  "We couldn't find any products matching your search criteria. Try adjusting your search query or filters."
                }
              </p>
              {productsList.length === 0 && (
                <span
                  style={{
                    display: "block",
                    marginTop: "16px",
                    fontSize: "0.75rem",
                    color: "#c53030",
                  }}
                >
                  🔴 Debug Warning: The backend API returned zero products.
                </span>
              )}
            </div>
          ) : (
            <div className="art-grid">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="art-card"
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest("button") || target.closest("a")) {
                      return;
                    }
                    router.push(`/product/${product.id}`);
                  }}
                >
                  <Link
                    href={`/product/${product.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="art-img-wrap">
                      <Image
                        src={product.image}
                        alt={product.name}
                        className="art-img"
                        width={400}
                        height={300}
                        priority={product.badge === "FEATURED"}
                      />
                      {product.badge ? <span className="art-badge">{product.badge}</span> : null}
                    </div>
                  </Link>
                  <div className="art-body">
                    <Link
                      href={`/product/${product.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="art-name">{product.name}</div>
                      <div className="art-medium">{product.medium}</div>
                    </Link>
                    <div className="art-footer">
                      <div className="art-price">{product.price}</div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Link
                          href={`/product/${product.id}`}
                          className="add-cart-btn"
                          style={{
                            background: "transparent",
                            color: "var(--gold)",
                            border: "1px solid var(--gold)",
                            textDecoration: "none",
                            lineHeight: "26px",
                            height: "32px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          className="add-cart-btn"
                          onClick={() => handleOpenOrderModal(product.name)}
                          style={{ height: "32px" }}
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              {NAV_SECTIONS.map(({ id, label }) => (
                <li key={id}>
                  <Link href={id === "hero" ? "/" : id === "reviews" ? "/reviews" : `/#${id}`}>
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

      {/* Order Modal */}
      <OrderModal
        open={orderModalOpen}
        title={selectedProductForOrder}
        onClose={() => setOrderModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      {toast ? <Toast message={toast.message} type={toast.type} /> : null}
    </>
  );
}
