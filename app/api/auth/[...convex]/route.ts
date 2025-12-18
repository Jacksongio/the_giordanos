import { NextRequest, NextResponse } from "next/server";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function GET(request: NextRequest) {
  if (!CONVEX_URL) {
    return NextResponse.json({ error: "Convex URL not configured" }, { status: 500 });
  }

  const url = new URL(request.url);
  // Extract path after /api/auth (e.g., /callback/google)
  const path = url.pathname.replace("/api/auth", "");
  // Convex HTTP routes are accessed via /api/http/[path]
  const convexUrl = `${CONVEX_URL}/api/http${path}${url.search}`;

  try {
    const response = await fetch(convexUrl, {
      method: "GET",
      headers: {
        ...Object.fromEntries(request.headers.entries()),
        // Remove host header as it will be set by fetch
        host: undefined,
      } as any,
    });

    // Handle redirects
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("Location");
      if (location) {
        return NextResponse.redirect(location);
      }
    }

    const data = await response.text();
    const contentType = response.headers.get("Content-Type") || "text/html";
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error forwarding auth request to Convex:", error);
    return NextResponse.json({ error: "Failed to forward request" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!CONVEX_URL) {
    return NextResponse.json({ error: "Convex URL not configured" }, { status: 500 });
  }

  const url = new URL(request.url);
  // Extract path after /api/auth (e.g., /callback/google)
  const path = url.pathname.replace("/api/auth", "");
  // Convex HTTP routes are accessed via /api/http/[path]
  const convexUrl = `${CONVEX_URL}/api/http${path}${url.search}`;
  const body = await request.text();

  try {
    const response = await fetch(convexUrl, {
      method: "POST",
      headers: {
        ...Object.fromEntries(request.headers.entries()),
        // Remove host header as it will be set by fetch
        host: undefined,
      } as any,
      body,
    });

    // Handle redirects
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("Location");
      if (location) {
        return NextResponse.redirect(location);
      }
    }

    const data = await response.text();
    const contentType = response.headers.get("Content-Type") || "text/html";
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error forwarding auth request to Convex:", error);
    return NextResponse.json({ error: "Failed to forward request" }, { status: 500 });
  }
}

