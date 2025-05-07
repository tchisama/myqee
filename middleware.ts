export { auth as middleware } from "@/auth"

// Configure middleware to run only on specific paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|images).*)'],
}
