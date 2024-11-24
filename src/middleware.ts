import * as jose from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
    console.debug(error);
    return false;
  }
};

export const middleware = async (req: NextRequest) => {
  const isAuth = await isAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, message: "authentication failed" },
      { status: 401 }
    );
  }
};

export const config = {
  matcher: ["/api/analytics", "/api/checkAuth"],
};
