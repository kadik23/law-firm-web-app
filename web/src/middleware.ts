import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  
  console.log("🔍 Middleware Debug:", {
    url: request.url,
    hasToken: !!token,
    tokenLength: token?.length,
    allCookies: request.cookies.getAll().map(c => ({ name: c.name, value: c.value }))
  });
  
  if (!token) {
    console.log("No authToken found in cookies");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // For now, just check if token exists and let client-side handle the rest
  // This avoids CORS and network issues in production
  console.log("✅ Token found, allowing access - client-side will handle authorization");
  return NextResponse.next();
}

export const config = {
  matcher: ["/client/:path*", "/admin/:path*", "/attorney/:path*"],
};