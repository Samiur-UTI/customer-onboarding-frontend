import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes
const protectedRoutes = ["/"]
const authRoutes = ["/login", "/signup"]

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname
  const token = request.cookies.get("auth-token")?.value

  // Check if the route is protected and user is not authenticated
  if (protectedRoutes.includes(currentPath) && !token) {
    const url = new URL("/login", request.url)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.includes(currentPath) && token) {
    const url = new URL("/", request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

