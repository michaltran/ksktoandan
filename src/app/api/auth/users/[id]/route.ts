import { NextRequest, NextResponse } from "next/server";
import { deleteUser } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const me = await getCurrentUser();
  if (!me || me.role !== "admin") return NextResponse.json({ ok: false, error: "Không có quyền" }, { status: 403 });
  if (me.id === Number(params.id)) {
    return NextResponse.json({ ok: false, error: "Không thể xóa chính mình" }, { status: 400 });
  }
  await deleteUser(Number(params.id));
  return NextResponse.json({ ok: true });
}
