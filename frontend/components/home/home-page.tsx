"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import {
  ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  INSTAGRAM_URL,
  MAPS_URL,
  NAV_SECTIONS,
  WHATSAPP_URL,
} from "@/lib/home/constants";
import {
  aboutFeatures,
  artworks,
  categories,
  homeImage,
  pricingTiers,
  stats,
  steps,
} from "@/lib/home/data";
import { OrderModal } from "./order-modal";
import { Toast } from "./toast";
import { SubmitReviewModal } from "./submit-review-modal";
import { AdminPanel } from "./admin-panel";
import { Review } from "@/lib/reviews-store";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

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

interface HomePageProps {
  onOpenModal: (title: string, size?: string) => void;
  onShowToast: (message: string, type?: "success" | "info") => void;
}

function HomeNav({ activeSection }: { activeSection: string }) {
  return (
    <nav id="navbar" className={undefined}>
      <a
        className="logo"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("hero");
        }}
      >
        <BrandLogo />
      </a>
      <ul className="nav-links">
        {NAV_SECTIONS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={activeSection === id ? "active" : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(id);
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-right">
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nav-wa">
          WhatsApp
        </a>
      </div>
    </nav>
  );
}

function HeroSection({ onOpenModal }: Pick<HomePageProps, "onOpenModal">) {
  return (
    <section id="hero">
      <div className="hero-blob" style={{ width: 500, height: 500, top: -100, right: -100 }} />
      <div className="hero-blob" style={{ width: 300, height: 300, bottom: -80, left: -80 }} />
      <div className="hero-text">
        <div className="hero-eyebrow">Bringing Memories to Life</div>
        <h1 className="hero-title">
          Handcrafted Art
          <br />
          That Speaks
          <br />
          From the <span className="script">Heart</span>
        </h1>
        <p className="hero-desc">
          Custom portraits, beautiful paintings &amp; Islamic calligraphy — made with passion,
          precision &amp; dedication.
        </p>
        <div className="hero-btns">
          <button
            type="button"
            className="btn-gold"
            onClick={() => onOpenModal("Custom Portrait Order")}
          >
            Order Custom Portrait
          </button>
          <button type="button" className="btn-outline" onClick={() => scrollToSection("featured")}>
            Explore Collection
          </button>
        </div>
        <div className="hero-proof">
          <div className="avatars">
            <div className="avatar">SK</div>
            <div className="avatar">AR</div>
            <div className="avatar">HF</div>
            <div className="avatar" style={{ fontSize: ".55rem" }}>
              500+
            </div>
          </div>
          <div>
            <div className="stars">★★★★★</div>
            <div className="proof-text">
              <strong>500+</strong> Happy Customers • 4.9 (120+ Reviews)
            </div>
          </div>
        </div>
      </div>
      <div className="hero-imgs">
        <Image
          src={homeImage(1)}
          alt="Featured artwork"
          className="hero-main"
          width={460}
          height={345}
          priority
        />
        <Image
          src={homeImage(2)}
          alt="Portrait sample"
          className="hero-float l"
          width={150}
          height={200}
        />
        <Image
          src={homeImage(3)}
          alt="Artwork sample"
          className="hero-float r"
          width={130}
          height={173}
        />
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section id="categories">
      <div className="sec-head reveal">
        <div className="divider-line">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>
            Browse Categories
          </h2>
        </div>
      </div>
      <div className="cats">
        {categories.map((cat) => (
          <a
            key={cat.label}
            className="cat"
            href="#featured"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("featured");
            }}
          >
            <Image src={cat.image} alt={cat.label} width={300} height={300} />
            <div className="cat-lbl">{cat.label}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

function FeaturedSection({ onOpenModal }: Pick<HomePageProps, "onOpenModal">) {
  return (
    <section id="featured">
      <div className="sec-head reveal">
        <p className="eyebrow">Our Bestsellers</p>
        <div className="divider-line">
          <h2>Featured Paintings</h2>
        </div>
      </div>
      <div className="art-grid">
        {artworks.map((art) => (
          <div
            key={art.name}
            className="art-card"
            onClick={() => onOpenModal(`Order: ${art.name}`)}
          >
            <div className="art-img-wrap">
              <Image src={art.image} alt={art.name} className="art-img" width={400} height={300} />
              {art.badge ? <span className="art-badge">{art.badge}</span> : null}
            </div>
            <div className="art-body">
              <div className="art-name">{art.name}</div>
              <div className="art-medium">{art.medium}</div>
              <div className="art-footer">
                <div className="art-price">{art.price}</div>
                <button
                  type="button"
                  className="add-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal(`Order: ${art.name}`);
                  }}
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingSection({ onOpenModal }: Pick<HomePageProps, "onOpenModal">) {
  return (
    <section id="pricing">
      <div className="sec-head reveal">
        <p className="eyebrow">Transparent Pricing</p>
        <div className="divider-line">
          <h2>Size &amp; Price Guide</h2>
        </div>
      </div>
      <div className="price-cards">
        {pricingTiers.map((tier) => (
          <div key={tier.size} className={`price-card${tier.featured ? " featured-price" : ""}`}>
            {tier.featured ? <span className="price-badge">Most Popular</span> : null}
            <div className="price-size">{tier.size}</div>
            <div className="price-unit">Inches</div>
            <div className="price-amt">{tier.amount}</div>
            <div className="price-pkr">Pakistani Rupees</div>
            <ul className="price-features">
              {tier.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button
              type="button"
              className="price-order-btn"
              onClick={() => onOpenModal("Order Artwork", tier.orderValue)}
            >
              Order This Size
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowSection() {
  return (
    <section id="how">
      <div className="sec-head reveal">
        <div className="divider-line">
          <h2>How It Works</h2>
        </div>
        <p>Your custom artwork in 4 simple steps</p>
      </div>
      <div className="how-inner">
        <div className="steps reveal">
          {steps.map((step) => (
            <div key={step.title} className="step">
              <div className="step-ico">
                <svg viewBox="0 0 24 24" aria-hidden>
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="how-cta reveal">
          <Image src={homeImage(29)} alt="Artwork preview" width={400} height={225} />
          <h3>
            Want a Custom
            <br />
            Portrait?
          </h3>
          <p>
            Turn your precious memories into timeless art. One photo is all we need to create
            something extraordinary.
          </p>
          <a
            href={`${WHATSAPP_URL}?text=${encodeURIComponent("Hi Anaya! I want to order a custom portrait.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about">
      <div className="about-inner">
        <div className="about-img-wrap reveal">
          <Image
            src={homeImage(30)}
            className="about-main"
            alt="The Artist"
            width={500}
            height={625}
          />
          <div className="about-frame" />
          <div className="about-badge">
            <div className="num">40+</div>
            <div className="lbl">Happy Clients</div>
          </div>
        </div>
        <div className="reveal">
          <p className="eyebrow">About The Artist</p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.2rem",
              color: "var(--dark)",
              marginBottom: 16,
            }}
          >
            Passion, Precision
            <br />
            &amp; <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Dedication</em>
          </h2>
          <div style={{ width: 48, height: 2, background: "var(--gold)", marginBottom: 20 }} />
          <p
            className="about-text"
            style={{ fontSize: ".9rem", color: "var(--muted)", lineHeight: 1.85, marginBottom: 14 }}
          >
            With years of experience, we create realistic portraits, wildlife art, Islamic
            calligraphy and many more. Every brush stroke is made with passion, dedication and love.
          </p>
          <p
            style={{ fontSize: ".9rem", color: "var(--muted)", lineHeight: 1.85, marginBottom: 14 }}
          >
            Based at {ADDRESS}, Anaya Art Corner has delivered over 1,000 artworks to happy clients
            across the country and internationally.
          </p>
          <div className="sig">Anaya</div>
          <div className="feats">
            {aboutFeatures.map((feat) => (
              <div key={feat.title} className="feat">
                <div className="feat-ico">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <h5>{feat.title}</h5>
                  <p>{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section id="stats" style={{ padding: "56px 60px" }}>
      <div className="stats-row reveal">
        {stats.map((stat) => (
          <div key={stat.label} className="stat">
            <div className="stat-n">{stat.value}</div>
            <div className="stat-l">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewsSection() {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

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

  const homepageReviews = sortedReviews.slice(0, visibleCount);

  return (
    <section id="reviews">
      <div className="sec-head reveal">
        <p className="eyebrow">Testimonials</p>
        <div className="divider-line">
          <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem" }}>
            What Our Customers Say
          </h2>
        </div>
      </div>

      {/* Filtering and Sorting Controls */}
      <div className="rev-controls" style={{ marginBottom: 32 }}>
        <div className="rev-sort-group">
          <label htmlFor="sort-select">Sort By: </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "newest" | "oldest" | "highest" | "lowest")
            }
          >
            <option value="newest">Newest Reviews</option>
            <option value="oldest">Oldest Reviews</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
        <button type="button" className="btn-gold" onClick={() => setSubmitModalOpen(true)}>
          Write a Review
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "40px 0" }}>
          Loading reviews...
        </p>
      ) : sortedReviews.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--muted)", padding: "40px 0" }}>
          No reviews yet. Be the first customer to share your experience.
        </p>
      ) : (
        <div className="rev-grid">
          {homepageReviews.map((review) => (
            <div key={review.id} className="rev-card">
              <div className="rev-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: i < review.rating ? "var(--gold)" : "#ddd6cc" }}>
                    ★
                  </span>
                ))}
              </div>
              <p className="rev-text line-clamp-4">&ldquo;{review.text}&rdquo;</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  width: "100%",
                }}
              >
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
                  {new Date(review.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Testimonials Actions */}
      {reviewsList.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
          {visibleCount < sortedReviews.length ? (
            <button
              type="button"
              className="btn-gold"
              onClick={() => setVisibleCount((prev) => prev + 3)}
            >
              Show More Reviews
            </button>
          ) : (
            <Link href="/reviews" className="btn-gold" style={{ textDecoration: "none" }}>
              View All Reviews ({reviewsList.length})
            </Link>
          )}
        </div>
      )}

      {/* Admin Access Link */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <button type="button" className="rev-admin-link" onClick={() => setAdminPanelOpen(true)}>
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ marginRight: 6 }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Admin Panel Access
        </button>
      </div>

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
    </section>
  );
}

function ContactSection({ onShowToast }: Pick<HomePageProps, "onShowToast">) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const email = String(data.get("email") ?? "");
    const type = String(data.get("type") ?? "");
    const size = String(data.get("size") ?? "");
    const message = String(data.get("message") ?? "");

    const text = [
      "Hi Anaya Art Corner!",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : "",
      type ? `Artwork Type: ${type}` : "",
      size ? `Size: ${size}` : "",
      message ? `Message: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(text)}`, "_blank");
    onShowToast("Opening WhatsApp with your message!", "success");
    form.reset();
  };

  return (
    <section id="contact">
      <div className="sec-head reveal">
        <p className="eyebrow">Get In Touch</p>
        <div className="divider-line">
          <h2>
            Let&apos;s Create Something{" "}
            <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Beautiful</em>
          </h2>
        </div>
      </div>
      <div className="contact-inner">
        <div className="contact-left reveal">
          <p>
            Ready to turn your memories into a masterpiece? Fill the form or contact us directly on
            WhatsApp for a quick response.
          </p>
          <div className="c-rows">
            <div className="c-row">
              <div className="c-ico">
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.1a16 16 0 006 6l1.46-1.46a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
                </svg>
              </div>
              <p>{CONTACT_PHONE}</p>
            </div>
            <div className="c-row">
              <div className="c-ico">
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <p>{CONTACT_EMAIL}</p>
            </div>
            <div className="c-row">
              <div className="c-ico">
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: ".85rem", color: "var(--muted)", marginBottom: 4 }}>
                  {ADDRESS}
                </p>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: ".75rem",
                    color: "var(--gold)",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
        <form className="c-form reveal" onSubmit={handleSubmit}>
          <div className="f-row">
            <div className="f-group">
              <label htmlFor="c_name">Your Name</label>
              <input id="c_name" name="name" type="text" placeholder="Enter your name" required />
            </div>
            <div className="f-group">
              <label htmlFor="c_phone">Phone</label>
              <input id="c_phone" name="phone" type="tel" placeholder="+92 3xx xxxxxxx" />
            </div>
          </div>
          <div className="f-group">
            <label htmlFor="c_email">Email</label>
            <input id="c_email" name="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="f-group">
            <label htmlFor="c_type">Artwork Type</label>
            <select id="c_type" name="type" defaultValue="">
              <option value="">Select type</option>
              <option>Custom Portrait</option>
              <option>Wildlife / Animal Painting</option>
              <option>Wedding Portrait</option>
              <option>Vehicle Sketch</option>
              <option>Islamic Calligraphy</option>
              <option>Figurative Painting</option>
              <option>Other</option>
            </select>
          </div>
          <div className="f-group">
            <label htmlFor="c_size">Size Required</label>
            <select id="c_size" name="size" defaultValue="">
              <option value="">Select size</option>
              <option>8 × 10 inches — Rs. 4,000</option>
              <option>12 × 16 inches — Rs. 6,000</option>
              <option>16 × 20 inches — Rs. 10,000</option>
              <option>20 × 30 inches — Rs. 20,000</option>
            </select>
          </div>
          <div className="f-group">
            <label htmlFor="c_msg">Message</label>
            <textarea
              id="c_msg"
              name="message"
              rows={4}
              placeholder="Describe your artwork idea, reference photo details..."
            />
          </div>
          <button
            type="submit"
            className="btn-gold"
            style={{ justifyContent: "center", width: "100%" }}
          >
            Send via WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}

function InstagramSection() {
  return (
    <section
      id="instagram"
      style={{ background: "white", padding: "72px 60px", textAlign: "center" }}
    >
      <div className="sec-head reveal" style={{ marginBottom: 36 }}>
        <p className="eyebrow">Follow Us</p>
        <div className="divider-line">
          <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem" }}>
            Find Us on <span style={{ color: "#E1306C" }}>Instagram</span>
          </h2>
        </div>
        <p style={{ fontSize: ".9rem", color: "var(--muted)", marginTop: 10 }}>
          See our latest artwork, behind-the-scenes &amp; customer transformations
        </p>
      </div>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="reveal"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          textDecoration: "none",
          background:
            "linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
          color: "white",
          padding: "16px 36px",
          borderRadius: 50,
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        @anayaartcorner1
      </a>
    </section>
  );
}

function HomeFooter() {
  return (
    <footer>
      <div className="ft-grid">
        <div className="ft-brand">
          <div className="n">Anaya</div>
          <div className="s">Art Corner</div>
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
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(id);
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="ft-col">
          <h4>Services</h4>
          <ul>
            <li>
              <a
                href="#how"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("how");
                }}
              >
                Custom Portraits
              </a>
            </li>
            <li>
              <a
                href="#featured"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("featured");
                }}
              >
                Wildlife Art
              </a>
            </li>
            <li>
              <a
                href="#featured"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("featured");
                }}
              >
                Wedding Portraits
              </a>
            </li>
            <li>
              <a
                href="#featured"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("featured");
                }}
              >
                Islamic Calligraphy
              </a>
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
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export function HomePage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Order Artwork");
  const [modalSize, setModalSize] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  useReveal();

  const showToast = useCallback((message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const openModal = useCallback((title: string, size = "") => {
    setModalTitle(title);
    setModalSize(size);
    setModalOpen(true);
  }, []);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const onScroll = () => {
      navbar?.classList.toggle("scrolled", window.scrollY > 40);

      const sections = NAV_SECTIONS.map((s) => s.id);
      let current = "hero";
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 130) current = id;
      });
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <HomeNav activeSection={activeSection} />
      <HeroSection onOpenModal={openModal} />
      <CategoriesSection />
      <FeaturedSection onOpenModal={openModal} />
      <PricingSection onOpenModal={openModal} />
      <HowSection />
      <AboutSection />
      <StatsSection />
      <ReviewsSection />
      <ContactSection onShowToast={showToast} />
      <InstagramSection />
      <HomeFooter />
      <OrderModal
        key={`${modalTitle}-${modalSize}`}
        open={modalOpen}
        title={modalTitle}
        defaultSize={modalSize}
        onClose={() => setModalOpen(false)}
        onShowToast={showToast}
      />
      {toast ? <Toast message={toast.message} type={toast.type} /> : null}
    </>
  );
}
