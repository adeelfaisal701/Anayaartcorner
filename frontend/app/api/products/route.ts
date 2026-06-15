import { NextResponse } from "next/server";
import { artworks } from "@/lib/home/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Return product data in standard format
    // Map products to both keys to handle any client-side mappings:
    // e.g., res.data, res.data.products, res.products, etc.
    const products = artworks.map((art) => ({
      ...art,
      // Fallback slug generation just in case
      id:
        art.id ||
        art.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
    }));

    return NextResponse.json({
      success: true,
      data: {
        products: products,
      },
      products: products,
    });
  } catch (error) {
    console.error("API GET Products Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
