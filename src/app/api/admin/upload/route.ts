import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { ApiError } from "@/lib/api/errors";
import { backend } from "@/lib/api/server";
import { getSession } from "@/lib/auth/session";

/**
 * Product image upload. It's a route handler rather than a server action so
 * large images aren't subject to the server-action body size limit.
 */
export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  const incoming = await request.formData();
  const productId = String(incoming.get("productId") ?? "");
  const files = incoming.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (!productId || files.length === 0) {
    return NextResponse.json({ success: false, message: "Choose at least one image." }, { status: 400 });
  }

  const outgoing = new FormData();
  outgoing.append("productId", productId);
  for (const file of files) outgoing.append("images", file, file.name);

  try {
    const data = await backend("/products/media/upload", { method: "POST", body: outgoing });
    // Route handlers can't use updateTag(); expire immediately instead.
    revalidateTag("products", { expire: 0 });
    revalidateTag(`product:${productId}`, { expire: 0 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    const message = error instanceof ApiError ? error.message : "Upload failed.";
    return NextResponse.json({ success: false, message }, { status });
  }
}
