"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { SubmitReviewModal } from "@/components/home/submit-review-modal";
import { AdminPanel } from "@/components/home/admin-panel";
import { Review } from "@/lib/reviews-store";
import {
  ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  NAV_SECTIONS,
  WHATSAPP_URL,
} from "@/lib/home/constants";

function BrandLogo() {
  return (
    <svg viewBox="0 0 120 52" xmlns="http://www.w3.org/2000/svg" width="180" height="52" aria-hidden>
      <path d="M22 10 A16 16 0 1 0 22 42 A11 11 0 1 1 22 10Z" fill="none" stroke="#C8962A" strokeWidth="1.8" />
      <line x1="34" y1="8" x2="14" y2="44" stroke="#C8962A" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M34 8 Q30 20 22 32 Q18 38 14 44" fill="none" stroke="#C8962A" strokeWidth="1" opacity="0.55" />
      <path d="M14 44 Q20 36 28 22 Q32 14 34 8" fill="none" stroke="#C8962A" strokeWidth="0.9" opacity="0.35" />
      <circle cx="14" cy="44" r="1.6" fill="#C8962A" />
      <line x1="48" y1="10" x2="48" y2="42" stroke="#C8962A" strokeWidth="0.8" opacity="0.4" />
      <text x="56" y="28" fontFamily="'Dancing Script', cursive" fontSize="22" fill="#1a1008" fontWeight="700">
        Anaya
      </text>
      <text x="57" y="39" fontFamily="Inter, sans-serif" fontSize="7" fill="#C8962A" fontWeight="600" letterSpacing="3">
        ART CORNER
      </text>
    </svg>
  );
}

export default function ReviewsPage() {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch("/api/reviews");
      const data = await response.json();
      if (data.success) {
        setReviewsList(data.reviews);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchReviews]);

  const sortedReviews = [...reviewsList].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
    return 0;
  });

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
                className={id === "reviews" ? "active" : undefined}
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

      {/* Main Reviews Container */}
      <main style={{ minHeight: "80vh", background: "var(--cream)", padding: "48px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Section Head */}
          <div className="sec-head" style={{ marginBottom: 40 }}>
            <p className="eyebrow">All Testimonials</p>
            <div className="divider-line">
              <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2.5rem" }}>What Our Customers Say</h2>
            </div>
            <p style={{ marginTop: 8 }}>Read detailed reviews from our 500+ happy clients nationwide.</p>
          </div>

          {/* Filtering and Sorting Controls */}
          <div className="rev-controls" style={{ marginBottom: 32 }}>
            <div className="rev-sort-group">
              <label htmlFor="sort-select">Sort By: </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "highest" | "lowest")}
              >
                <option value="newest">Newest Reviews</option>
                <option value="oldest">Oldest Reviews</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
            <button
              type="button"
              className="btn-gold"
              onClick={() => setSubmitModalOpen(true)}
            >
              Write a Review
            </button>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", color: "var(--muted)", padding: "80px 0" }}>Loading all reviews...</p>
          ) : sortedReviews.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--muted)", padding: "80px 0" }}>No reviews yet. Be the first customer to share your experience.</p>
          ) : (
            <div className="rev-grid">
              {sortedReviews.map((review) => (
                <div key={review.id} className="rev-card">
                  <div className="rev-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: i < review.rating ? "var(--gold)" : "#ddd6cc" }}>
                        ★
                      </span>
                    ))}
                  </div>
                  {/* Note: Full text (no line clamp) on this page */}
                  <p className="rev-text">&ldquo;{review.text}&rdquo;</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
                    <div className="reviewer">
                      {review.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={review.photo}
                          alt={review.name}
                          className="rev-av"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="rev-av" style={{ background: review.color }}>
                          {review.initials}
                        </div>
                      )}
                      <div>
                        <div className="rev-name">{review.name}</div>
                        <div className="rev-loc">{review.location || "Verified Client"}</div>
                      </div>
                    </div>
                    <div className="rev-date" style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
                      {new Date(review.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Admin Access Link */}
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button
              type="button"
              className="rev-admin-link"
              onClick={() => setAdminPanelOpen(true)}
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 6 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Admin Panel Access
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: "var(--dark2)", padding: "52px 60px 0" }}>
        <div className="ft-grid">
          <div className="ft-brand">
            <div className="n">Anaya</div>
            <div className="s">Art Corner</div>
            <p>
              We create timeless art that captures emotions and turns memories into masterpieces. Every piece is made with
              passion and love.
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

      {/* Modals */}
      <SubmitReviewModal
        open={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSuccess={fetchReviews}
      />
      
      <AdminPanel
        open={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
        onRefreshReviews={fetchReviews}
      />
    </>
  );
}
