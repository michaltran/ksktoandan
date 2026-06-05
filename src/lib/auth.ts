import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// ============================================================
// Phiên đăng nhập dạng JWT lưu trong cookie httpOnly.
// Dùng AUTH_SECRET (env). Nếu chưa đặt -> dùng secret dev (cảnh báo).
// ============================================================

export const SESSION_COOKIE = "ksk_session";

export interface SessionUser {
  id: number;
  username: string;
  full_name: string;
  role: "admin" | "user";
}

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET || "dev-only-insecure-secret-change-me-please-32x";
  return new TextEncoder().encode(s);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: Number(payload.id),
      username: String(payload.username),
      full_name: String(payload.full_name),
      role: (payload.role as "admin" | "user") ?? "user",
    };
  } catch {
    return null;
  }
}

// Đọc người dùng hiện tại trong Server Component / Route Handler
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
