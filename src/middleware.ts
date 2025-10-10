// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Include all headers your frontend might send
const allowedHeaders = [
  "Content-Type",
  "Authorization",
  "x-store-id",
  "Accept",
  "Origin",
  "User-Agent",
  "Referer",
];

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") || "*";

  // ✅ Handle preflight requests
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": allowedHeaders.join(", "),
        "Access-Control-Max-Age": "86400", // cache preflight for 24h
      },
    });
  }

  // ✅ For all other requests
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.headers.set("Access-Control-Allow-Headers", allowedHeaders.join(", "));
  return res;
}

export const config = {
  matcher: "/api/:path*",
};
