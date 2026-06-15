import { NextRequest, NextResponse } from "next/server";
import { artworks } from "@/lib/home/data";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Map products and find the requested one
    const products = artworks.map((art) => ({
      ...art,
      id:
        art.id ||
        art.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
    }));

    const product = products.find((p) => p.id === id);

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("API GET Product ID Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}
