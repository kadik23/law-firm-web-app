import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  if (!token) {
    console.log("Token validation failed")
    return NextResponse.redirect(new URL("/", request.url));
  }
  try {
    const validateUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/validate`;
    const response = await fetch(validateUrl, {
      method: "GET",
      headers: {
        Cookie: `${"authToken=" + token}`, 
      },
    });

    if (!response.ok) {
      throw new Error("Token validation failed");
    }
    const userData = await response.json();

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
    if (error instanceof Error) {
      console.error("Middleware token validation error:", error.message);
    } else {
      console.error("Middleware token validation error:", error);
    }
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/client/:path*", "/admin/:path*", "/attorney/:path*"],
};