import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get("admin")?.value
  const isLoginPage = request.nextUrl.pathname === "/admin/login"

  // Se não está logado e não está na página de login → redireciona
  if (!isAdmin && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // Se já está logado e tenta acessar o login → redireciona pro painel
  if (isAdmin && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

// Aplica o middleware apenas nas rotas /admin/*
export const config = {
  matcher: ["/admin/:path*"],
}