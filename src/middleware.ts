import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const protectedPaths = ["/dashboard", "/profile", "/settings"];
  const apiProtectedPaths = ["/api/protected"];

  const pathIsProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  const apiPathIsProtected = apiProtectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  if (!pathIsProtected && !apiPathIsProtected) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    if (apiPathIsProtected) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url); // Save original URL
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile", "/settings", "/api/protected/:path*"],
};
