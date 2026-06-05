import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

// ============================================================
// Lớp truy cập dữ liệu.
// - Nếu có biến môi trường DATABASE_URL (Neon): dùng Postgres.
// - Nếu chưa cấu hình (chạy thử local): dùng file JSON tạm trong .data/
//   (chỉ phục vụ chạy thử; trên Vercel bắt buộc dùng Neon).
// ============================================================

export interface KskRecord {
  id: number;
  form_id: string;
  child_name: string;
  dob: string | null;
  mchat_score: number | null;
  values: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbUser {
  id: number;
  username: string;
  password_hash: string;
  full_name: string;
  role: "admin" | "user";
  created_at: string;
}

const useNeon = !!process.env.DATABASE_URL;
const sql = useNeon ? neon(process.env.DATABASE_URL!) : null;

// ---------- Khởi tạo bảng ----------
let initialized = false;
export async function ensureSchema(): Promise<void> {
  if (!useNeon) return;
  if (initialized) return;
  await sql!`
    CREATE TABLE IF NOT EXISTS ksk_records (
      id SERIAL PRIMARY KEY,
      form_id TEXT NOT NULL,
      child_name TEXT NOT NULL DEFAULT '',
      dob TEXT,
      mchat_score INTEGER,
      values JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  // Cột created_by có thể chưa tồn tại nếu bảng được tạo từ phiên bản trước
  await sql!`ALTER TABLE ksk_records ADD COLUMN IF NOT EXISTS created_by TEXT;`;
  await sql!`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL DEFAULT '',
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  initialized = true;
}

// ---------- Fallback file local ----------
const dataDir = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "records.json");

function readLocal(): KskRecord[] {
  try {
    if (!fs.existsSync(dataFile)) return [];
    return JSON.parse(fs.readFileSync(dataFile, "utf-8")) as KskRecord[];
  } catch {
    return [];
  }
}
function writeLocal(rows: KskRecord[]): void {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(rows, null, 2), "utf-8");
}

// ============================================================
// API dữ liệu
// ============================================================
export async function listRecords(formId?: string, q?: string): Promise<KskRecord[]> {
  await ensureSchema();
  const query = (q ?? "").trim();
  if (useNeon) {
    const like = `%${query}%`;
    let rows;
    if (formId && query) {
      rows = await sql!`SELECT * FROM ksk_records WHERE form_id = ${formId} AND child_name ILIKE ${like} ORDER BY id DESC`;
    } else if (formId) {
      rows = await sql!`SELECT * FROM ksk_records WHERE form_id = ${formId} ORDER BY id DESC`;
    } else if (query) {
      rows = await sql!`SELECT * FROM ksk_records WHERE child_name ILIKE ${like} ORDER BY id DESC`;
    } else {
      rows = await sql!`SELECT * FROM ksk_records ORDER BY id DESC`;
    }
    return rows as KskRecord[];
  }
  let rows = readLocal().sort((a, b) => b.id - a.id);
  if (formId) rows = rows.filter((r) => r.form_id === formId);
  if (query) {
    const ql = query.toLowerCase();
    rows = rows.filter((r) => (r.child_name || "").toLowerCase().includes(ql));
  }
  return rows;
}

export async function getRecord(id: number): Promise<KskRecord | null> {
  await ensureSchema();
  if (useNeon) {
    const rows = (await sql!`SELECT * FROM ksk_records WHERE id = ${id}`) as KskRecord[];
    return rows[0] ?? null;
  }
  return readLocal().find((r) => r.id === id) ?? null;
}

interface UpsertInput {
  form_id: string;
  child_name: string;
  dob: string | null;
  mchat_score: number | null;
  values: Record<string, unknown>;
  created_by?: string | null;
}

export async function createRecord(input: UpsertInput): Promise<KskRecord> {
  await ensureSchema();
  if (useNeon) {
    const rows = (await sql!`
      INSERT INTO ksk_records (form_id, child_name, dob, mchat_score, values, created_by)
      VALUES (${input.form_id}, ${input.child_name}, ${input.dob}, ${input.mchat_score}, ${JSON.stringify(
      input.values
    )}::jsonb, ${input.created_by ?? null})
      RETURNING *;
    `) as KskRecord[];
    return rows[0];
  }
  const rows = readLocal();
  const id = rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;
  const now = new Date().toISOString();
  const rec: KskRecord = {
    id,
    form_id: input.form_id,
    child_name: input.child_name,
    dob: input.dob,
    mchat_score: input.mchat_score,
    values: input.values,
    created_by: input.created_by ?? null,
    created_at: now,
    updated_at: now,
  };
  rows.push(rec);
  writeLocal(rows);
  return rec;
}

export async function updateRecord(id: number, input: UpsertInput): Promise<KskRecord | null> {
  await ensureSchema();
  if (useNeon) {
    const rows = (await sql!`
      UPDATE ksk_records
      SET form_id = ${input.form_id},
          child_name = ${input.child_name},
          dob = ${input.dob},
          mchat_score = ${input.mchat_score},
          values = ${JSON.stringify(input.values)}::jsonb,
          updated_at = now()
      WHERE id = ${id}
      RETURNING *;
    `) as KskRecord[];
    return rows[0] ?? null;
  }
  const rows = readLocal();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  rows[idx] = {
    ...rows[idx],
    form_id: input.form_id,
    child_name: input.child_name,
    dob: input.dob,
    mchat_score: input.mchat_score,
    values: input.values,
    updated_at: new Date().toISOString(),
  };
  writeLocal(rows);
  return rows[idx];
}

export async function deleteRecord(id: number): Promise<void> {
  await ensureSchema();
  if (useNeon) {
    await sql!`DELETE FROM ksk_records WHERE id = ${id}`;
    return;
  }
  writeLocal(readLocal().filter((r) => r.id !== id));
}

export function storageMode(): "neon" | "local" {
  return useNeon ? "neon" : "local";
}

// ============================================================
// USERS
// ============================================================
const usersFile = path.join(dataDir, "users.json");
function readUsers(): DbUser[] {
  try {
    if (!fs.existsSync(usersFile)) return [];
    return JSON.parse(fs.readFileSync(usersFile, "utf-8")) as DbUser[];
  } catch {
    return [];
  }
}
function writeUsers(rows: DbUser[]): void {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(usersFile, JSON.stringify(rows, null, 2), "utf-8");
}

export async function countUsers(): Promise<number> {
  await ensureSchema();
  if (useNeon) {
    const rows = (await sql!`SELECT COUNT(*)::int AS n FROM users`) as { n: number }[];
    return rows[0]?.n ?? 0;
  }
  return readUsers().length;
}

export async function getUserByUsername(username: string): Promise<DbUser | null> {
  await ensureSchema();
  if (useNeon) {
    const rows = (await sql!`SELECT * FROM users WHERE username = ${username}`) as DbUser[];
    return rows[0] ?? null;
  }
  return readUsers().find((u) => u.username === username) ?? null;
}

export async function listUsers(): Promise<DbUser[]> {
  await ensureSchema();
  if (useNeon) {
    return (await sql!`SELECT * FROM users ORDER BY id ASC`) as DbUser[];
  }
  return readUsers().sort((a, b) => a.id - b.id);
}

export async function createUser(input: {
  username: string;
  password_hash: string;
  full_name: string;
  role: "admin" | "user";
}): Promise<DbUser> {
  await ensureSchema();
  if (useNeon) {
    const rows = (await sql!`
      INSERT INTO users (username, password_hash, full_name, role)
      VALUES (${input.username}, ${input.password_hash}, ${input.full_name}, ${input.role})
      RETURNING *;
    `) as DbUser[];
    return rows[0];
  }
  const rows = readUsers();
  if (rows.some((u) => u.username === input.username)) {
    throw new Error("Tên đăng nhập đã tồn tại");
  }
  const id = rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;
  const user: DbUser = { id, ...input, created_at: new Date().toISOString() };
  rows.push(user);
  writeUsers(rows);
  return user;
}

export async function deleteUser(id: number): Promise<void> {
  await ensureSchema();
  if (useNeon) {
    await sql!`DELETE FROM users WHERE id = ${id}`;
    return;
  }
  writeUsers(readUsers().filter((u) => u.id !== id));
}
