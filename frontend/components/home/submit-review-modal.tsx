"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface SubmitReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AVATAR_COLORS = [
  "#c8962a", // Gold
  "#2a6496", // Blue
  "#6a3d7a", // Purple
  "#2c6b4e", // Green
  "#a04040", // Red
  "#d6782a", // Orange
];

export function SubmitReviewModal({ open, onClose, onSuccess }: SubmitReviewModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Reset form
  const resetForm = () => {
    setName("");
    setLocation("");
    setRating(5);
    setText("");
    setPhotoPreview(null);
    setPhotoName("");
    setSubmitting(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handlePhotoUpload = (file: File | undefined) => {
    if (!file) return;
    
    // Validate size (max 2MB to keep Base64 storage reasonable)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo is too large! Max size is 2MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(String(event.target?.result ?? ""));
      setPhotoName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam prevention validation
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (name.length > 50) {
      toast.error("Name must be under 50 characters.");
      return;
    }
    if (!text.trim()) {
      toast.error("Please enter a review message.");
      return;
    }
    if (text.length > 500) {
      toast.error("Review message must be under 500 characters.");
      return;
    }

    setSubmitting(true);

    try {
      // Generate initials
      const initials = name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

      // Random color for avatar
      const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          rating,
          text: text.trim(),
          photo: photoPreview || undefined,
          location: location.trim() || undefined,
          initials,
          color,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Thank you! Your review has been submitted and is pending moderation.", {
          duration: 5000,
        });
        resetForm();
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Submit review error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className={`modal-bg open`} onClick={onClose} style={{ display: "flex" }}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="modal-head">
          <h3>Submit a Customer Review</h3>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="f-group">
            <label htmlFor="r_name">Your Name *</label>
            <input
              id="r_name"
              type="text"
              placeholder="e.g. Sana Khan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
            />
          </div>

          <div className="f-group">
            <label htmlFor="r_location">Location (Optional)</label>
            <input
              id="r_location"
              type="text"
              placeholder="e.g. Lahore, Pakistan"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={50}
            />
          </div>

          <div className="f-group" style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Rating *</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "2rem",
                    padding: 0,
                    color: (hoverRating || rating) >= star ? "var(--gold)" : "#ddd6cc",
                    transition: "color 0.15s ease",
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="f-group">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label htmlFor="r_text">Review Message *</label>
              <span style={{ fontSize: "0.65rem", color: text.length > 450 ? "var(--destructive)" : "var(--muted)" }}>
                {text.length} / 500
              </span>
            </div>
            <textarea
              id="r_text"
              rows={4}
              placeholder="Share your experience with Anaya Art Corner..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              required
            />
          </div>

          <div className="f-group" style={{ marginTop: 14 }}>
            <label>Upload Your Photo (Optional)</label>
            <div
              className="photo-upload-box"
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
              role="button"
              tabIndex={0}
              style={{ padding: "16px 20px" }}
            >
              <p style={{ margin: "4px 0 2px", fontSize: ".82rem", color: "#3a2e1a", fontWeight: 600 }}>
                Click to upload an image
              </p>
              <p style={{ fontSize: ".7rem", color: "#7a6a50" }}>JPG, PNG, WEBP — max 2MB</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
            />

            {photoPreview ? (
              <div style={{ marginTop: 10, position: "relative", textAlign: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview}
                  alt="Preview"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2.5px solid var(--gold)",
                    margin: "0 auto",
                    display: "block",
                  }}
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "calc(50% + 30px)",
                    background: "var(--destructive)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                  }}
                  title="Remove photo"
                >
                  ×
                </button>
                <p style={{ fontSize: ".7rem", color: "#7a6a50", marginTop: 4 }}>{photoName}</p>
              </div>
            ) : null}
          </div>

          <div className="modal-btns" style={{ marginTop: 20 }}>
            <button
              type="submit"
              className="btn-gold"
              disabled={submitting}
              style={{ flex: 1, justifyContent: "center" }}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={onClose}
              disabled={submitting}
              style={{ flex: 1, justifyContent: "center" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
