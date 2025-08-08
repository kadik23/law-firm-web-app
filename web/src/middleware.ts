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
  
  // If no token, redirect to home
  if (!token) {
    console.log("No authToken found in cookies");
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("✅ Token found, allowing access - client-side will handle authorization");
  return NextResponse.next();
}

export const config = {
  matcher: [],
};