"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT_EMAIL, WHATSAPP_URL } from "@/lib/home/constants";
import { sizeOptions } from "@/lib/home/data";

interface OrderModalProps {
  open: boolean;
  title: string;
  defaultSize?: string;
  onClose: () => void;
  onShowToast: (message: string, type?: "success" | "info") => void;
}

export function OrderModal({
  open,
  title,
  defaultSize = "",
  onClose,
  onShowToast,
}: OrderModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [size, setSize] = useState(defaultSize);
  const [note, setNote] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const resetPhoto = () => {
    setPhotoPreview(null);
    setPhotoName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handlePhotoUpload = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      onShowToast("Photo too large! Max 10MB.", "info");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(String(event.target?.result ?? ""));
      setPhotoName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const buildMessage = () =>
    [
      "Hi Anaya Art Corner!",
      "",
      `Order: ${title}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      size ? `Size: ${size}` : "",
      note ? `Notes: ${note}` : "",
      photoName ? `Reference photo: ${photoName} (please send the photo in this chat)` : "",
    ]
      .filter(Boolean)
      .join("\n");

  const submitWhatsApp = () => {
    if (!name.trim()) {
      onShowToast("Please enter your name.", "info");
      return;
    }
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(buildMessage())}`, "_blank");
    onShowToast("Opening WhatsApp...", "success");
    onClose();
  };

  const submitEmail = () => {
    if (!name.trim()) {
      onShowToast("Please enter your name.", "info");
      return;
    }
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(buildMessage());
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    onShowToast("Opening email client...", "success");
    onClose();
  };

  return (
    <div className={`modal-bg${open ? " open" : ""}`} onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="f-group">
            <label htmlFor="m_name">Your Name</label>
            <input
              id="m_name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="f-group">
            <label htmlFor="m_phone">Phone / WhatsApp</label>
            <input
              id="m_phone"
              type="tel"
              placeholder="+92 3xx xxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="f-group">
            <label htmlFor="m_size">Size Required</label>
            <select id="m_size" value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">Select size</option>
              {sizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="f-group">
            <label htmlFor="m_note">Special Instructions</label>
            <textarea
              id="m_note"
              rows={3}
              placeholder="Any special requirements, reference photo, etc."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="f-group">
            <label>Upload Reference Photo</label>
            <div
              className="photo-upload-box"
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <p
                style={{
                  margin: "8px 0 4px",
                  fontSize: ".85rem",
                  color: "#3a2e1a",
                  fontWeight: 600,
                }}
              >
                Click to upload your photo
              </p>
              <p style={{ fontSize: ".72rem", color: "#7a6a50" }}>JPG, PNG, WEBP — max 10MB</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
            />
            {photoPreview ? (
              <div style={{ marginTop: 10, position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 180,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: "2px solid #c8962a",
                  }}
                />
                <button
                  type="button"
                  onClick={resetPhoto}
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    background: "rgba(0,0,0,.6)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: 26,
                    height: 26,
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
                <p
                  style={{
                    fontSize: ".72rem",
                    color: "#7a6a50",
                    marginTop: 6,
                    textAlign: "center",
                  }}
                >
                  {photoName}
                </p>
              </div>
            ) : null}
          </div>
          <div className="modal-btns">
            <button type="button" className="btn-gold" onClick={submitWhatsApp}>
              Send via WhatsApp
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={submitEmail}
              style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
            >
              Send via Email
            </button>
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
