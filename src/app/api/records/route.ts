import { NextRequest, NextResponse } from "next/server";
import { listRecords, createRecord } from "@/lib/db";
import { getForm, scoreMchat } from "@/lib/forms/definitions";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const formId = req.nextUrl.searchParams.get("form") ?? undefined;
  const q = req.nextUrl.searchParams.get("q") ?? undefined;
  try {
    const rows = await listRecords(formId, q);
    return NextResponse.json({ ok: true, records: rows });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { form_id, values } = body as { form_id: string; values: Record<string, unknown> };
    const form = getForm(form_id);
    if (!form) return NextResponse.json({ ok: false, error: "Form không hợp lệ" }, { status: 400 });

    const child_name = String(values["hc_hoten"] ?? "").trim();
    const dob = values["hc_ngaysinh"] ? String(values["hc_ngaysinh"]) : null;
    const mchat_score = form_id === "mau9" ? scoreMchat(values) : null;

    const rec = await createRecord({ form_id, child_name, dob, mchat_score, values });
    return NextResponse.json({ ok: true, record: rec });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
