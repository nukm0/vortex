import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "admin_session";
const AUTH_VALUE = "owner-ok";

export function middleware(req: NextRequest) {
  const isAuth = req.cookies.get(AUTH_COOKIE)?.value === AUTH_VALUE;

  if (req.nextUrl.pathname.startsWith("/admin") && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
