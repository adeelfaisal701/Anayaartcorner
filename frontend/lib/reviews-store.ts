import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  photo?: string; // Base64 data URL or external URL
  status: "pending" | "approved" | "rejected";
  date: string; // ISO String
  initials: string;
  color: string;
  location?: string;
}

const JSON_FILE_PATH = path.join(process.cwd(), "data", "reviews.json");

// Default initial seed reviews
const BASE_SEED_REVIEWS: Review[] = [
  {
    id: "seed-1",
    name: "Sana Khan",
    rating: 5,
    text: "The portrait is beyond amazing! Exactly how I wanted. Highly recommended! The quality of work and attention to detail is absolutely wonderful.",
    status: "approved",
    date: "2026-06-08T10:00:00.000Z",
    initials: "SK",
    color: "var(--gold)",
    location: "Lahore, Pakistan",
  },
  {
    id: "seed-2",
    name: "Ali Raza",
    rating: 5,
    text: "Excellent work and perfect details. Delivered on time with great quality. The wedding portrait turned out to be an absolute masterpiece!",
    status: "approved",
    date: "2026-06-10T14:30:00.000Z",
    initials: "AR",
    color: "#2a6496",
    location: "Karachi, Pakistan",
  },
  {
    id: "seed-3",
    name: "Hina Fatima",
    rating: 5,
    text: "Beautiful artwork! Will order again for more paintings. Amazing experience. The lion painting I ordered looks absolutely stunning on my wall!",
    status: "approved",
    date: "2026-06-12T09:15:00.000Z",
    initials: "HF",
    color: "#6a3d7a",
    location: "Islamabad, Pakistan",
  },
];

// Lists for generating realistic reviews
const FIRST_NAMES_FEMALE = [
  "Amina",
  "Zainab",
  "Fatima",
  "Ayesha",
  "Kiran",
  "Sadia",
  "Sobia",
  "Maria",
  "Nida",
  "Rida",
  "Alisha",
  "Samra",
  "Hania",
  "Marium",
  "Iqra",
  "Zoya",
  "Anum",
  "Areeba",
  "Nadia",
  "Saba",
];
const FIRST_NAMES_MALE = [
  "Hamza",
  "Bilal",
  "Usman",
  "Imran",
  "Nabeel",
  "Omer",
  "Faisal",
  "Hassan",
  "Asad",
  "Kamran",
  "Zeeshan",
  "Ahmed",
  "Mustafa",
  "Saad",
  "Waqas",
  "Junaid",
  "Farhan",
  "Adnan",
  "Haris",
  "Tariq",
];
const LAST_NAMES = [
  "Khan",
  "Raza",
  "Fatima",
  "Malik",
  "Ahmed",
  "Iqbal",
  "Sheikh",
  "Siddiqui",
  "Bukhari",
  "Jamil",
  "Abbasi",
  "Dar",
  "Butt",
  "Shah",
  "Chaudhry",
  "Mughal",
  "Gillani",
  "Yousaf",
];
const LOCATIONS = [
  "Lahore, Pakistan",
  "Karachi, Pakistan",
  "Islamabad, Pakistan",
  "Faisalabad, Pakistan",
  "Rawalpindi, Pakistan",
  "Peshawar, Pakistan",
  "Multan, Pakistan",
  "Sialkot, Pakistan",
  "Gujranwala, Pakistan",
  "Quetta, Pakistan",
];
const AVATAR_COLORS = ["#c8962a", "#2a6496", "#6a3d7a", "#2c6b4e", "#a04040", "#d6782a"];

const PORTRAIT_PHOTOS_FEMALE = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop",
];

const PORTRAIT_PHOTOS_MALE = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop",
];

const REVIEW_TEMPLATES = [
  {
    rating: 5,
    texts: [
      "The portrait is beyond amazing! Exactly how I wanted. Highly recommended! The quality of work and attention to detail is absolutely wonderful.",
      "Excellent work and perfect details. Delivered on time with great quality. The wedding portrait turned out to be an absolute masterpiece!",
      "Beautiful artwork! Will order again for more paintings. Amazing experience. The lion painting I ordered looks absolutely stunning on my wall!",
      "I am in awe of the custom sketch I received! The shading is so detailed and captures the emotions perfectly. Very communicative on WhatsApp too.",
      "Beautifully painted Islamic calligraphy. The gold leaf accents glow so nicely in the evening light. Worth every rupee!",
      "Excellent customer service! Delivery was safe and the painting was packed so securely with multiple layers of bubble wrap. Highly recommend Anaya Art Corner.",
      "Ordered a portrait for my husband's birthday and he was absolutely thrilled! The likeness is incredible. Thank you for making his day special.",
      "The calligraphy painting of Ayah Al-Kursi is gorgeous. The strokes are clean, and the canvas quality is premium. Definitely ordering again.",
      "Stunning wildlife painting! The horse sketch looks so dynamic and realistic. A true artist's touch is visible in every single brush stroke.",
      "Amazing talent! The pencil drawing of my family was completed ahead of schedule and the revisions I requested were made very quickly and politely.",
    ],
  },
  {
    rating: 5,
    texts: [
      "Highly recommended! The quality of art is top-notch and the framing is very sturdy and premium. Smooth ordering process.",
      "Absolutely love the portrait. The attention to detail is remarkable. Sana and her team are very professional.",
      "Ordered a wedding sketch and it was perfect. The packaging was very secure and delivered on time to Karachi.",
      "Excellent work! The colors are so vibrant and exactly match the reference photo I shared. Highly satisfied.",
      "A masterpiece! The calligraphy painting is the highlight of my drawing room now. Everyone asks about it.",
      "Wonderful experience. The artist kept me updated with pictures during the process. Great service.",
      "Very neat and beautiful work. The sketch was ready within a week as promised. Will definitely order more.",
      "Highly professional and gifted artist. The custom painting of my cat was so sweet and realistic.",
      "Superb quality and friendly communication. Very patient with my custom size requirements.",
      "The oil painting is breathtaking. The texture and depth of colors are amazing. Exceeded all my expectations.",
    ],
  },
  {
    rating: 4,
    texts: [
      "Very nice painting. The portrait looks very close to the photo. Delivery was delayed by one day but overall great experience.",
      "Good quality sketch and nice framing. The communication on WhatsApp was quick. Will recommend to others.",
      "Beautiful calligraphy. The canvas is sturdy and colors are great. Just wish the border spacing was slightly wider, but still looks amazing.",
      "Really liked the pencil sketch. The likeness is good. Overall satisfied with the work and service.",
      "Nice artwork, the detailing on the face is done very well. Received it in safe packaging. Good value for money.",
    ],
  },
];

// Generator function to generate 65 additional reviews (for ~68 total)
function generateSampleReviews(): Review[] {
  const reviews: Review[] = [...BASE_SEED_REVIEWS];
  const now = new Date();

  // Generate 65 reviews to get 68 reviews total
  for (let i = 0; i < 65; i++) {
    const isFemale = i % 2 === 0;
    const firstName = isFemale
      ? FIRST_NAMES_FEMALE[i % FIRST_NAMES_FEMALE.length]
      : FIRST_NAMES_MALE[i % FIRST_NAMES_MALE.length];

    // Mix and match last names, locations, and colors
    const lastName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const initials = (firstName[0] + lastName[0]).toUpperCase();
    const color = AVATAR_COLORS[(i * 7) % AVATAR_COLORS.length];
    const location = LOCATIONS[(i * 11) % LOCATIONS.length];

    // Photo allocation (roughly 60% of reviews get a photo)
    let photo: string | undefined = undefined;
    if (i % 5 !== 0) {
      photo = isFemale
        ? PORTRAIT_PHOTOS_FEMALE[Math.floor((i / 2) % PORTRAIT_PHOTOS_FEMALE.length)]
        : PORTRAIT_PHOTOS_MALE[Math.floor((i / 2) % PORTRAIT_PHOTOS_MALE.length)];
    }

    // Select review text based on template pattern
    const templateCategory = REVIEW_TEMPLATES[i % REVIEW_TEMPLATES.length];
    const rating = templateCategory.rating;
    const textsList = templateCategory.texts;
    const text = textsList[(i * 13) % textsList.length];

    // Stagger dates realistically over the last 12 months
    const dateOffsetDays = Math.floor((i * 365) / 65) + 1; // 1 to 365 days ago
    const reviewDate = new Date(now.getTime() - dateOffsetDays * 24 * 60 * 60 * 1000);

    reviews.push({
      id: `sample-${i}`,
      name,
      rating,
      text,
      photo,
      status: "approved", // Automatically approved
      date: reviewDate.toISOString(),
      initials,
      color,
      location,
    });
  }

  return reviews;
}

// Generate the complete set of reviews (68 reviews)
const SEED_REVIEWS = generateSampleReviews();

// Initialize Supabase Client if env variables are available
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);
const supabase = isSupabaseConfigured ? createClient(supabaseUrl!, supabaseKey!) : null;

// JSON File Helpers
function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function readReviewsFromFile(): Review[] {
  try {
    if (!fs.existsSync(JSON_FILE_PATH)) {
      ensureDirectoryExistence(JSON_FILE_PATH);
      fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(SEED_REVIEWS, null, 2), "utf-8");
      return SEED_REVIEWS;
    }
    const data = fs.readFileSync(JSON_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading reviews from file, using seeds:", error);
    return SEED_REVIEWS;
  }
}

function writeReviewsToFile(reviews: Review[]) {
  try {
    ensureDirectoryExistence(JSON_FILE_PATH);
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(reviews, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing reviews to file:", error);
  }
}

// Database API functions
export async function getReviews(): Promise<Review[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Supabase getReviews error:", error);
        return readReviewsFromFile();
      }

      if (data && data.length > 0) {
        return data as Review[];
      }

      // If table is empty, seed it in Supabase with all 68 generated reviews
      const seedData = SEED_REVIEWS.map((r) => ({
        id: r.id,
        name: r.name,
        rating: r.rating,
        text: r.text,
        photo: r.photo || null,
        status: r.status,
        date: r.date,
        initials: r.initials,
        color: r.color,
        location: r.location || null,
      }));

      const { error: seedError } = await supabase.from("reviews").insert(seedData);
      if (!seedError) {
        return SEED_REVIEWS;
      }
    } catch (e) {
      console.error("Supabase getReviews exception:", e);
    }
  }

  // Fallback to local JSON storage
  return readReviewsFromFile();
}

export async function addReview(review: Omit<Review, "id" | "date" | "status">): Promise<Review> {
  const newReview: Review = {
    ...review,
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 11),
    date: new Date().toISOString(),
    status: "pending", // Always pending moderation initially
  };

  if (supabase) {
    try {
      const { error } = await supabase.from("reviews").insert({
        id: newReview.id,
        name: newReview.name,
        rating: newReview.rating,
        text: newReview.text,
        photo: newReview.photo || null,
        status: newReview.status,
        date: newReview.date,
        initials: newReview.initials,
        color: newReview.color,
        location: newReview.location || null,
      });

      if (!error) {
        return newReview;
      }
      console.error("Supabase addReview error:", error);
    } catch (e) {
      console.error("Supabase addReview exception:", e);
    }
  }

  // Fallback to local JSON storage
  const reviews = readReviewsFromFile();
  reviews.unshift(newReview);
  writeReviewsToFile(reviews);
  return newReview;
}

export async function updateReview(id: string, updates: Partial<Review>): Promise<Review | null> {
  if (supabase) {
    try {
      const dbUpdates: Partial<Review> = { ...updates };

      const { data, error } = await supabase
        .from("reviews")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return data as Review;
      }
      console.error("Supabase updateReview error:", error);
    } catch (e) {
      console.error("Supabase updateReview exception:", e);
    }
  }

  // Fallback to local JSON storage
  const reviews = readReviewsFromFile();
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const updatedReview = { ...reviews[index], ...updates };
  reviews[index] = updatedReview;
  writeReviewsToFile(reviews);
  return updatedReview;
}

export async function deleteReview(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (!error) {
        return true;
      }
      console.error("Supabase deleteReview error:", error);
    } catch (e) {
      console.error("Supabase deleteReview exception:", e);
    }
  }

  // Fallback to local JSON storage
  const reviews = readReviewsFromFile();
  const filtered = reviews.filter((r) => r.id !== id);
  if (filtered.length === reviews.length) return false;

  writeReviewsToFile(filtered);
  return true;
}

export function isDbUsingSupabase(): boolean {
  return isSupabaseConfigured;
}
