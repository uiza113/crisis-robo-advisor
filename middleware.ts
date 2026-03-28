import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portfolio/:path*",
    "/crisis-simulator/:path*",
    "/communications/:path*",
    "/adviser-console/:path*",
    "/admin/:path*",
  ],
};
