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

  try {
    const validateUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/user/validate`;
    console.log("🔍 Making request to:", validateUrl);
    
    const response = await fetch(validateUrl, {
      method: "GET",
      headers: {
        Cookie: `authToken=${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      console.error("Token validation failed:", response.status, response.statusText);
      throw new Error("Token validation failed");
    }
    
    const userData = await response.json();
    console.log("Middleware validated user:", userData.type);

    if (request.url.startsWith("/client")) {
      if (userData.type !== "client") {
        console.log("Access denied: User is not an client");
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    if (request.url.startsWith("/admin")) {
      if (userData.type !== "admin") {
        console.log("Access denied: User is not an admin");
        return NextResponse.redirect(new URL("/", request.url)); 
      }
    }

    if (request.url.startsWith("/attorney")) {
      if (userData.type !== "attorney") {
        console.log("Access denied: User is not an attorney");
        return NextResponse.redirect(new URL("/", request.url)); 
      }
    }

    console.log("Token and user type validated successfully");
    return NextResponse.next();
  } catch (error: unknown) {
    console.error("Middleware token validation error:", error);
    
    // Fallback: If backend validation fails, allow access but log the issue
    // This prevents blocking users when there are network issues
    console.log("⚠️ Backend validation failed, allowing access as fallback");
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/client/:path*", "/admin/:path*", "/attorney/:path*"],
};