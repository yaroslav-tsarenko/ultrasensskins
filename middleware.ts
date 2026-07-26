import { type NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "@/lib/token-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.endsWith("/avontshop.html")) {
    const url = request.nextUrl.clone();
    url.pathname = "/avontshop.html";
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("session_token")?.value;
    const payload = token ? await verifyTokenEdge(token) : null;

    if (!payload) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
