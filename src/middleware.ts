import * as jose from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { VisiterType } from "./backend/apiTypes";
import { isBotCrawling } from "./isBotCrawling";

export const isAuthenticated = async (req: NextRequest) => {
  const cookies = req.cookies;
  const token = cookies.get("token")?.value;

  if (!token) {
    return false;
  }

  try {
    await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return true;
  } catch (error) {
    void error;
    return false;
  }
};

const authenticateVisitor = async (req: NextRequest) => {
  const cookies = req.cookies;
  const token = cookies.get("visiterToken")?.value;

  if (!token) {
    throw new Error("No token found");
  }

  const visiter = await jose.jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );
  return visiter.payload as VisiterType;
};

export const middleware = async (req: NextRequest) => {
  const url = req.nextUrl.pathname;

  if (url === "/api/analytics" || url === "/api/checkAuth") {
    const isAuth = await isAuthenticated(req);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: "authentication failed" },
        { status: 401 }
      );
    }
  }

  if (url === "/api/visit") {
    const isBot = isBotCrawling(req.headers.get("user-agent") ?? "");
    if (isBot) {
      return NextResponse.json(
        { success: false, message: "bot detected" },
        { status: 403 }
      );
    }

    try {
      const visiter = await authenticateVisitor(req);

      const headers = new Headers(req.headers);
      headers.set("x-visiter", JSON.stringify(visiter));

      return NextResponse.next({ request: { headers } });
    } catch (error) {
      void error;
      // Do nothing, a new token will be created
    }
  }
};

export const config = {
  matcher: ["/api/:path*"],
};
