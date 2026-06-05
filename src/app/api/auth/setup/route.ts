import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { countUsers, createUser } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Tạo tài khoản quản trị đầu tiên (chỉ khi chưa có user nào)
export async function POST(req: NextRequest) {
  try {
    const n = await countUsers();
    if (n > 0) return NextResponse.json({ ok: false, error: "Hệ thống đã được khởi tạo" }, { status: 400 });

    const { username, full_name, password } = await req.json();
    if (!username || !password || String(password).length < 6) {
      return NextResponse.json({ ok: false, error: "Tên đăng nhập và mật khẩu (>= 6 ký tự) là bắt buộc" }, { status: 400 });
    }

    const hash = await bcrypt.hash(String(password), 10);
    const user = await createUser({
      username: String(username).trim(),
      password_hash: hash,
      full_name: String(full_name || "").trim(),
      role: "admin",
    });

    const token = await createSessionToken({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: "admin",
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
