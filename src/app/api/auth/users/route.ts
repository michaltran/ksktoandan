import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { listUsers, createUser, getUserByUsername } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") return null;
  return me;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false, error: "Không có quyền" }, { status: 403 });
  const users = await listUsers();
  return NextResponse.json({
    ok: true,
    users: users.map((u) => ({ id: u.id, username: u.username, full_name: u.full_name, role: u.role })),
  });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false, error: "Không có quyền" }, { status: 403 });
  try {
    const { username, full_name, password, role } = await req.json();
    if (!username || !password || String(password).length < 6) {
      return NextResponse.json({ ok: false, error: "Tên đăng nhập và mật khẩu (>= 6 ký tự) là bắt buộc" }, { status: 400 });
    }
    if (await getUserByUsername(String(username).trim())) {
      return NextResponse.json({ ok: false, error: "Tên đăng nhập đã tồn tại" }, { status: 400 });
    }
    const hash = await bcrypt.hash(String(password), 10);
    const user = await createUser({
      username: String(username).trim(),
      password_hash: hash,
      full_name: String(full_name || "").trim(),
      role: role === "admin" ? "admin" : "user",
    });
    return NextResponse.json({ ok: true, user: { id: user.id, username: user.username } });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
