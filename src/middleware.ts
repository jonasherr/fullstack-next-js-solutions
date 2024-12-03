import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  if (request.nextUrl.pathname.match(/listing\/\d+\/booking/)) {
    const hasAuthCookie = request.cookies.has("auth");
    if (hasAuthCookie) return;

    return NextResponse.redirect("http://localhost:3000/login");
  }
};
