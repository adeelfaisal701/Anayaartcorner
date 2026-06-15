import { NextRequest, NextResponse } from "next/server";
import { getReviews, addReview, updateReview, deleteReview, Review } from "@/lib/reviews-store";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "anaya123";

// Helper to verify admin credentials with logging
function verifyAdmin(request: NextRequest, actionName: string): boolean {
  const password = request.headers.get("x-admin-password");
  const isMatch = password === ADMIN_PASSWORD;
  const ip =
    (request as NextRequest & { ip?: string }).ip ||
    request.headers.get("x-forwarded-for") ||
    "unknown";

  if (!isMatch) {
    console.warn(
      `[AUTH WARNING] Unauthorized admin action attempt: ${actionName}. ` +
        `IP: ${ip}, ` +
        `Header present: ${password !== null}, ` +
        `Password length: ${password ? password.length : 0}`,
    );
  } else {
    console.log(`[AUTH INFO] Authorized admin action: ${actionName} from IP: ${ip}`);
  }

  return isMatch;
}

// GET: Fetch reviews
// Public gets approved reviews only.
// Admin gets all reviews (approved, pending, rejected).
export async function GET(request: NextRequest) {
  try {
    const reviews = await getReviews();
    const hasPasswordHeader = request.headers.has("x-admin-password");

    if (hasPasswordHeader) {
      const isAdmin = verifyAdmin(request, "GET_REVIEWS_ADMIN");
      if (isAdmin) {
        return NextResponse.json({ success: true, reviews });
      } else {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Invalid admin password" },
          { status: 401 },
        );
      }
    }

    const approvedReviews = reviews.filter((r) => r.status === "approved");
    return NextResponse.json({ success: true, reviews: approvedReviews });
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST: Submit a new review (starts as pending)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, rating, text, photo, location, initials, color } = body;

    // 1. Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    if (name.length > 50) {
      return NextResponse.json(
        { success: false, error: "Name is too long (max 50 characters)" },
        { status: 400 },
      );
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Review message is required" },
        { status: 400 },
      );
    }
    if (text.length > 500) {
      return NextResponse.json(
        { success: false, error: "Review is too long (max 500 characters)" },
        { status: 400 },
      );
    }

    // Optional photo size check if Base64
    if (photo && typeof photo === "string") {
      // rough base64 size check (limit to ~2MB)
      const approxSizeBytes = (photo.length * 3) / 4;
      if (approxSizeBytes > 2 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Photo is too large (max 2MB)" },
          { status: 400 },
        );
      }
    }

    const finalInitials =
      initials && typeof initials === "string"
        ? initials.substring(0, 2).toUpperCase()
        : name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    const finalColor = color && typeof color === "string" ? color : "#c8962a";

    // 2. Add Review
    const newReview = await addReview({
      name: name.trim(),
      rating: ratingNum,
      text: text.trim(),
      photo,
      location: location ? location.trim() : undefined,
      initials: finalInitials || "U",
      color: finalColor,
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit review" }, { status: 500 });
  }
}

// PUT: Update review (approve/reject, edit) - admin only
export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdmin(request, "PUT_UPDATE_REVIEW")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid admin password" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { id, status, name, rating, text, location } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Review ID is required" }, { status: 400 });
    }

    const updates: Partial<Review> = {};
    if (status !== undefined) {
      if (status !== "pending" && status !== "approved" && status !== "rejected") {
        return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
      }
      updates.status = status;
    }

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: "Name cannot be empty" },
          { status: 400 },
        );
      }
      updates.name = name.trim();
    }

    if (rating !== undefined) {
      const ratingNum = Number(rating);
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return NextResponse.json(
          { success: false, error: "Rating must be between 1 and 5" },
          { status: 400 },
        );
      }
      updates.rating = ratingNum;
    }

    if (text !== undefined) {
      if (typeof text !== "string" || text.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: "Text cannot be empty" },
          { status: 400 },
        );
      }
      updates.text = text.trim();
    }

    if (location !== undefined) {
      updates.location = location ? location.trim() : undefined;
    }

    const updated = await updateReview(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    console.error("API PUT Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update review" }, { status: 500 });
  }
}

// DELETE: Remove review - admin only
export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAdmin(request, "DELETE_REVIEW")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid admin password" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Review ID is required" }, { status: 400 });
    }

    const deleted = await deleteReview(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API DELETE Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete review" }, { status: 500 });
  }
}
