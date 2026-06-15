export const homeImage = (index: number) => `/images/home/img-${index}.webp`;

export const categories = [
  { label: "Custom Portraits", image: homeImage(4) },
  { label: "Wildlife Art", image: homeImage(5) },
  { label: "Figurative Art", image: homeImage(6) },
  { label: "Wedding Portraits", image: homeImage(7) },
  { label: "Vehicle Sketches", image: homeImage(8) },
];

export const artworks = [
  {
    id: "artist-at-work",
    name: "Artist at Work",
    medium: "Oil on Canvas",
    price: "Custom Price",
    badge: "FEATURED",
    image: homeImage(9),
  },
  {
    id: "portrait-color-pencil",
    name: "Portrait — Color Pencil",
    medium: "Color Pencil on Paper",
    price: "Rs. 4,000+",
    badge: "BESTSELLER",
    image: homeImage(10),
  },
  {
    id: "horse-calligraphy",
    name: "Horse & Calligraphy",
    medium: "Oil on Canvas",
    price: "Rs. 10,000+",
    badge: "POPULAR",
    image: homeImage(11),
  },
  {
    id: "figurative-portrait",
    name: "Figurative Portrait",
    medium: "Oil on Canvas",
    price: "Rs. 6,000+",
    badge: "",
    image: homeImage(12),
  },
  {
    id: "musician-portrait",
    name: "Musician Portrait",
    medium: "Oil on Canvas",
    price: "Rs. 6,000+",
    badge: "",
    image: homeImage(13),
  },
  {
    id: "pencil-sketch-portrait",
    name: "Pencil Sketch Portrait",
    medium: "Color Pencil Sketch",
    price: "Rs. 4,000+",
    badge: "",
    image: homeImage(14),
  },
  {
    id: "leopard-painting",
    name: "Leopard Painting",
    medium: "Oil on Canvas",
    price: "Rs. 10,000+",
    badge: "UNIQUE",
    image: homeImage(15),
  },
  {
    id: "couple-portrait",
    name: "Couple Portrait",
    medium: "Oil on Canvas",
    price: "Rs. 8,000+",
    badge: "POPULAR",
    image: homeImage(16),
  },
  {
    id: "gentleman-portrait",
    name: "Gentleman Portrait",
    medium: "Color Pencil on Paper",
    price: "Rs. 4,000+",
    badge: "BESTSELLER",
    image: homeImage(17),
  },
  {
    id: "chess-players",
    name: "Chess Players",
    medium: "Oil on Canvas",
    price: "Rs. 15,000+",
    badge: "UNIQUE",
    image: homeImage(18),
  },
  {
    id: "side-profile-portrait",
    name: "Side Profile Portrait",
    medium: "Oil on Canvas",
    price: "Rs. 6,000+",
    badge: "",
    image: homeImage(19),
  },
  {
    id: "military-couple-portrait",
    name: "Military Couple Portrait",
    medium: "Oil on Canvas",
    price: "Rs. 8,000+",
    badge: "POPULAR",
    image: homeImage(20),
  },
  {
    id: "happy-customer",
    name: "Happy Customer",
    medium: "Color Pencil on Paper",
    price: "Rs. 4,000+",
    badge: "BESTSELLER",
    image: homeImage(21),
  },
  {
    id: "executive-portrait",
    name: "Executive Portrait",
    medium: "Oil on Canvas",
    price: "Rs. 6,000+",
    badge: "",
    image: homeImage(22),
  },
  {
    id: "child-portrait",
    name: "Child Portrait",
    medium: "Color Pencil on Paper",
    price: "Rs. 4,000+",
    badge: "POPULAR",
    image: homeImage(23),
  },
  {
    id: "smart-gentleman",
    name: "Smart Gentleman",
    medium: "Color Pencil Sketch",
    price: "Rs. 4,000+",
    badge: "",
    image: homeImage(24),
  },
  {
    id: "horse-painting",
    name: "Horse Painting",
    medium: "Oil on Canvas",
    price: "Rs. 10,000+",
    badge: "UNIQUE",
    image: homeImage(25),
  },
  {
    id: "group-hunting-scene",
    name: "Group Hunting Scene",
    medium: "Oil on Canvas",
    price: "Rs. 20,000+",
    badge: "UNIQUE",
    image: homeImage(26),
  },
  {
    id: "baby-portrait",
    name: "Baby Portrait",
    medium: "Color Pencil on Paper",
    price: "Rs. 4,000+",
    badge: "POPULAR",
    image: homeImage(27),
  },
  {
    id: "historical-portrait",
    name: "Historical Portrait",
    medium: "Oil on Canvas",
    price: "Rs. 8,000+",
    badge: "",
    image: homeImage(28),
  },
  {
    id: "golden-tap-water-fountain",
    name: "Golden Tap Water Fountain",
    medium: "Handcrafted Resin Fountain",
    price: "Rs. 20,000",
    badge: "NEW",
    image: homeImage(31),
  },
  {
    id: "bear-forest-waterfall",
    name: "Bear & Forest Waterfall",
    medium: "Mixed Media Diorama",
    price: "Rs. 20,000",
    badge: "NEW",
    image: homeImage(32),
  },
  {
    id: "sunset-leopard-diorama",
    name: "Sunset Leopard Diorama",
    medium: "3D Diorama Frame",
    price: "Rs. 20,000",
    badge: "NEW",
    image: homeImage(33),
  },
];

export const pricingTiers = [
  {
    size: "8 × 10",
    amount: "4,000",
    orderValue: "8x10 – Rs. 4,000",
    featured: false,
    features: ["A4 Portrait Size", "Color Pencil / Charcoal", "Ready in 5–7 days", "Free Delivery"],
  },
  {
    size: "12 × 16",
    amount: "6,000",
    orderValue: "12x16 – Rs. 6,000",
    featured: true,
    features: [
      "Standard Portrait Size",
      "Oil / Watercolor / Pencil",
      "Ready in 7–10 days",
      "Free Delivery + Frame",
    ],
  },
  {
    size: "16 × 20",
    amount: "10,000",
    orderValue: "16x20 – Rs. 10,000",
    featured: false,
    features: [
      "Large Display Size",
      "Oil on Canvas",
      "Ready in 10–14 days",
      "Free Delivery + Premium Frame",
    ],
  },
  {
    size: "20 × 30",
    amount: "20,000",
    orderValue: "20x30 – Rs. 20,000",
    featured: false,
    features: [
      "Grand Statement Piece",
      "Oil on Canvas",
      "Ready in 14–21 days",
      "White Glove Delivery",
    ],
  },
];

export const steps = [
  {
    title: "1. Share Your Photo",
    description:
      "Send us your clear photo or idea via WhatsApp, email, or our contact form. The clearer the photo, the better the result.",
  },
  {
    title: "2. We Create Your Art",
    description:
      "Our skilled artist creates your masterpiece with passion and precision. We keep you updated throughout the process.",
  },
  {
    title: "3. Review & Approve",
    description:
      "We share a photo of the completed artwork. You can request revisions before we proceed to delivery.",
  },
  {
    title: "4. Safe Delivery",
    description:
      "Carefully packed and delivered to your doorstep anywhere in Pakistan. Framing included on most sizes.",
  },
];

export const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "1000+", label: "Artworks Completed" },
  { value: "40+", label: "Years Experience" },
  { value: "100%", label: "Satisfaction" },
];

export const reviews = [
  {
    initials: "SK",
    color: "var(--gold)",
    name: "Sana Khan",
    location: "Lahore, Pakistan",
    text: "The portrait is beyond amazing! Exactly how I wanted. Highly recommended! The quality of work and attention to detail is absolutely wonderful.",
  },
  {
    initials: "AR",
    color: "#2a6496",
    name: "Ali Raza",
    location: "Karachi, Pakistan",
    text: "Excellent work and perfect details. Delivered on time with great quality. The wedding portrait turned out to be an absolute masterpiece!",
  },
  {
    initials: "HF",
    color: "#6a3d7a",
    name: "Hina Fatima",
    location: "Islamabad, Pakistan",
    text: "Beautiful artwork! Will order again for more paintings. Amazing experience. The lion painting I ordered looks absolutely stunning on my wall!",
  },
];

export const aboutFeatures = [
  { title: "100% Handcrafted", description: "Every piece made by hand" },
  { title: "Premium Quality", description: "Professional art materials" },
  { title: "Client Satisfaction", description: "100% satisfaction guaranteed" },
  { title: "Secure Delivery", description: "Safe packaging, nationwide" },
];

export const sizeOptions = [
  { label: "8 × 10 inches — Rs. 4,000", value: "8x10 – Rs. 4,000" },
  { label: "12 × 16 inches — Rs. 6,000", value: "12x16 – Rs. 6,000" },
  { label: "16 × 20 inches — Rs. 10,000", value: "16x20 – Rs. 10,000" },
  { label: "20 × 30 inches — Rs. 20,000", value: "20x30 – Rs. 20,000" },
];

export const artworkTypes = [
  "Custom Portrait",
  "Wildlife / Animal Painting",
  "Wedding Portrait",
  "Vehicle Sketch",
  "Islamic Calligraphy",
  "Figurative Painting",
  "Other",
];
