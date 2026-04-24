import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const isLogin = req.nextUrl.pathname === "/admin/login"

  if (!isLogin) {
    const cookie = req.cookies.get("admin")
    if (cookie?.value !== "true") {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
