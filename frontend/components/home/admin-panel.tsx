"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Review } from "@/lib/reviews-store";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  onRefreshReviews: () => void;
}

export function AdminPanel({ open, onClose, onRefreshReviews }: AdminPanelProps) {
  const [password, setPassword] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("admin_password") || "";
    }
    return "";
  });
  const [authenticated, setAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("admin_authenticated") === "true";
    }
    return false;
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Edit Review Form state
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Load all reviews (with status) if authenticated
  const fetchAllReviews = useCallback(
    async (adminPassword = password) => {
      if (!adminPassword) return;
      setLoading(true);
      try {
        const response = await fetch("/api/reviews", {
          headers: {
            "x-admin-password": adminPassword,
          },
        });
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews);
          setAuthenticated(true);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("admin_password", adminPassword);
            sessionStorage.setItem("admin_authenticated", "true");
          }
        } else {
          console.error("Fetch admin reviews failed:", data.error || "Unknown error");
          toast.error(data.error || "Authentication failed.");
          setAuthenticated(false);
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("admin_password");
            sessionStorage.removeItem("admin_authenticated");
          }
        }
      } catch (error) {
        console.error("Fetch admin reviews error:", error);
        toast.error("Error connecting to admin api.");
      } finally {
        setLoading(false);
      }
    },
    [password],
  );

  // Re-fetch reviews whenever the panel is opened and authenticated
  useEffect(() => {
    if (open && authenticated && password) {
      const timer = setTimeout(() => {
        fetchAllReviews(password);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open, authenticated, password, fetchAllReviews]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Please enter a password.");
      return;
    }
    fetchAllReviews(password);
  };

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      const response = await fetch("/api/reviews", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`Review successfully ${newStatus}!`);
        fetchAllReviews();
        onRefreshReviews();
      } else {
        console.error(`Status update failed for review ${id}:`, data.error || "Unknown error");
        toast.error(data.error || "Failed to update review status.");
      }
    } catch (error) {
      console.error(`Status update error for review ${id}:`, error);
      toast.error("Something went wrong.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review? This cannot be undone."))
      return;
    try {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": password,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Review deleted successfully.");
        fetchAllReviews();
        onRefreshReviews();
      } else {
        console.error(`Delete failed for review ${id}:`, data.error || "Unknown error");
        toast.error(data.error || "Failed to delete review.");
      }
    } catch (error) {
      console.error(`Delete error for review ${id}:`, error);
      toast.error("Something went wrong.");
    }
  };

  const startEdit = (review: Review) => {
    setEditingReview(review);
    setEditName(review.name);
    setEditLocation(review.location || "");
    setEditRating(review.rating);
    setEditText(review.text);
  };

  const cancelEdit = () => {
    setEditingReview(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    if (!editName.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!editText.trim()) {
      toast.error("Message is required.");
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          id: editingReview.id,
          name: editName.trim(),
          location: editLocation.trim() || undefined,
          rating: editRating,
          text: editText.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Review updated successfully!");
        setEditingReview(null);
        fetchAllReviews();
        onRefreshReviews();
      } else {
        console.error(
          `Edit save failed for review ${editingReview.id}:`,
          data.error || "Unknown error",
        );
        toast.error(data.error || "Failed to update review.");
      }
    } catch (error) {
      console.error(`Edit save error for review ${editingReview.id}:`, error);
      toast.error("Something went wrong.");
    }
  };

  const filteredReviews = reviews.filter((r) => r.status === activeTab);
  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  if (!open) return null;

  return (
    <div className="modal-bg open" onClick={onClose} style={{ display: "flex" }}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "760px",
          width: "90%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="modal-head">
          <h3>Admin Review Panel</h3>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {!authenticated ? (
          // LOGIN SCREEN
          <form
            onSubmit={handleLogin}
            className="modal-body"
            style={{ padding: "40px 24px", textAlign: "center" }}
          >
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: 20 }}>
              Access is restricted. Please enter the administrator password.
            </p>
            <div className="f-group" style={{ maxWidth: "320px", margin: "0 auto 18px" }}>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ textAlign: "center" }}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
              style={{ padding: "10px 30px" }}
            >
              {loading ? "Verifying..." : "Verify Password"}
            </button>
          </form>
        ) : editingReview ? (
          // EDIT REVIEW FORM
          <form onSubmit={handleSaveEdit} className="modal-body" style={{ overflowY: "auto" }}>
            <h4
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.2rem",
                marginBottom: 16,
              }}
            >
              Edit Review Details
            </h4>

            <div className="f-group" style={{ marginBottom: 12 }}>
              <label>Customer Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={50}
                required
              />
            </div>

            <div className="f-group" style={{ marginBottom: 12 }}>
              <label>Location</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                maxLength={50}
              />
            </div>

            <div className="f-group" style={{ marginBottom: 12 }}>
              <label>Rating (1-5)</label>
              <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))}>
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>

            <div className="f-group" style={{ marginBottom: 18 }}>
              <label>Review Text</label>
              <textarea
                rows={4}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                maxLength={500}
                required
              />
            </div>

            <div className="modal-btns">
              <button type="submit" className="btn-gold">
                Save Changes
              </button>
              <button type="button" className="btn-outline" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          // ADMIN DASHBOARD
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
          >
            {/* TABS HEADER */}
            <div
              style={{
                display: "flex",
                background: "var(--cream)",
                borderBottom: "1px solid var(--border)",
                padding: "8px 12px 0",
              }}
            >
              {(["pending", "approved", "rejected"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "10px 18px",
                    background: activeTab === tab ? "white" : "none",
                    border: "1px solid " + (activeTab === tab ? "var(--border)" : "transparent"),
                    borderBottom: activeTab === tab ? "1px solid white" : "1px solid var(--border)",
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: activeTab === tab ? "var(--gold)" : "var(--muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: -1,
                    zIndex: activeTab === tab ? 2 : 1,
                  }}
                >
                  <span style={{ textTransform: "capitalize" }}>{tab}</span>
                  {tab === "pending" && pendingCount > 0 ? (
                    <span
                      style={{
                        background: "var(--destructive)",
                        color: "white",
                        fontSize: "0.65rem",
                        padding: "2px 6px",
                        borderRadius: 10,
                        fontWeight: 700,
                      }}
                    >
                      {pendingCount}
                    </span>
                  ) : null}
                </button>
              ))}
              <div style={{ flex: 1, borderBottom: "1px solid var(--border)" }} />
            </div>

            {/* REVIEWS LIST */}
            <div
              className="modal-body"
              style={{ overflowY: "auto", flex: 1, padding: "20px 24px" }}
            >
              {loading ? (
                <p style={{ textAlign: "center", color: "var(--muted)" }}>Loading reviews...</p>
              ) : filteredReviews.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--muted)", padding: "20px 0" }}>
                  No {activeTab} reviews found.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {filteredReviews.map((review) => (
                    <div
                      key={review.id}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        padding: 16,
                        background: "var(--cream)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      {/* REVIEW HEADER */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {review.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={review.photo}
                              alt={review.name}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: review.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                              }}
                            >
                              {review.initials}
                            </div>
                          )}
                          <div>
                            <div
                              style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--dark)" }}
                            >
                              {review.name}
                            </div>
                            <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                              {review.location || "No Location"} •{" "}
                              {new Date(review.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {/* STARS DISPLAY */}
                        <div style={{ color: "var(--gold)", fontSize: "0.9rem" }}>
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                      </div>

                      {/* TEXT */}
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text)",
                          fontStyle: "italic",
                          margin: 0,
                        }}
                      >
                        &ldquo;{review.text}&rdquo;
                      </p>

                      {/* ACTIONS */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 8,
                          borderTop: "1px solid rgba(0,0,0,0.05)",
                          paddingTop: 10,
                        }}
                      >
                        {review.status !== "approved" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(review.id, "approved")}
                            style={{
                              padding: "6px 12px",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              background: "var(--gold)",
                              color: "white",
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                            }}
                          >
                            Approve
                          </button>
                        )}
                        {review.status !== "rejected" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(review.id, "rejected")}
                            style={{
                              padding: "6px 12px",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              background: "#3d3832",
                              color: "white",
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                            }}
                          >
                            Reject
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => startEdit(review)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            background: "none",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(review.id)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            background: "var(--destructive)",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FOOTER ACTIONS */}
            <div
              style={{
                padding: 16,
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--cream)",
              }}
            >
              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  setAuthenticated(false);
                  setPassword("");
                  if (typeof window !== "undefined") {
                    sessionStorage.removeItem("admin_password");
                    sessionStorage.removeItem("admin_authenticated");
                  }
                }}
                style={{ padding: "8px 16px" }}
              >
                Log Out
              </button>
              <button
                type="button"
                className="btn-gold"
                onClick={onClose}
                style={{ padding: "8px 24px" }}
              >
                Close Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
