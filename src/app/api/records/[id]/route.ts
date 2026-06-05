import { NextRequest, NextResponse } from "next/server";
import { getRecord, updateRecord, deleteRecord } from "@/lib/db";
import { getForm, scoreMchat } from "@/lib/forms/definitions";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const rec = await getRecord(Number(params.id));
  if (!rec) return NextResponse.json({ ok: false, error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json({ ok: true, record: rec });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { form_id, values } = body as { form_id: string; values: Record<string, unknown> };
    const form = getForm(form_id);
    if (!form) return NextResponse.json({ ok: false, error: "Form không hợp lệ" }, { status: 400 });

    const child_name = String(values["hc_hoten"] ?? "").trim();
    const dob = values["hc_ngaysinh"] ? String(values["hc_ngaysinh"]) : null;
    const mchat_score = form_id === "mau9" ? scoreMchat(values) : null;

    const rec = await updateRecord(Number(params.id), { form_id, child_name, dob, mchat_score, values });
    if (!rec) return NextResponse.json({ ok: false, error: "Không tìm thấy" }, { status: 404 });
    return NextResponse.json({ ok: true, record: rec });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteRecord(Number(params.id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
