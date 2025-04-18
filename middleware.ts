import { NextRequest, NextResponse } from "next/server";
import { protectedRoutes } from "@/middleware/config";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const matched = protectedRoutes.find(({ path }) => path.test(pathname));
  if (!matched) return NextResponse.next();

  const sessionDataRes = await fetch(`${req.nextUrl.origin}/api/auth/user`, {
    headers: {
      Cookie: req.headers.get("Cookie") || "",
    },
  });

  if (!sessionDataRes.ok) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { role }: { role: string } = await sessionDataRes.json();

  if (matched.roles && !matched.roles.includes(role)) {
    return NextResponse.json(
      { message: "Forbidden: Insufficient role" },
      { status: 403 },
    );
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user", JSON.stringify(role));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
