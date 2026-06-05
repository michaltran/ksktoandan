import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByUsername } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const user = await getUserByUsername(String(username || "").trim());
    if (!user) return NextResponse.json({ ok: false, error: "Sai tên đăng nhập hoặc mật khẩu" }, { status: 401 });

    const ok = await bcrypt.compare(String(password || ""), user.password_hash);
    if (!ok) return NextResponse.json({ ok: false, error: "Sai tên đăng nhập hoặc mật khẩu" }, { status: 401 });

    const token = await createSessionToken({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
    });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
