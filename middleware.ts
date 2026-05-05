import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Add proxy headers for network requests
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-forwarded-proto', 'https');
    requestHeaders.set('x-forwarded-host', req.headers.get('host') || 'localhost:3000');
    
    if (!isPublicRoute(req)) {
      const { userId } = await auth();
      if (!userId) {
        const { redirectToSignIn } = await auth();
        return redirectToSignIn();
      }
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // Fallback: allow request to proceed if Clerk fails
    if (isPublicRoute(req)) {
      return;
    }
    // For protected routes, redirect to sign-in with error handling
    const url = new URL('/sign-in', req.url);
    url.searchParams.set('error', 'auth_failed');
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
