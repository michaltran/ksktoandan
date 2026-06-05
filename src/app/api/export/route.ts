import { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { listRecords, KskRecord } from "@/lib/db";
import { FORMS, getForm } from "@/lib/forms/definitions";
import type { Field } from "@/lib/forms/schema";

export const dynamic = "force-dynamic";

function flatFields(formId: string): Field[] {
  const form = getForm(formId);
  if (!form) return [];
  return form.sections.flatMap((s) => s.fields);
}

function cellValue(v: unknown): string {
  if (v == null) return "";
  if (Array.isArray(v)) return v.join("; ");
  if (typeof v === "boolean") return v ? "x" : "";
  return String(v);
}

export async function GET(req: NextRequest) {
  const formFilter = req.nextUrl.searchParams.get("form") ?? undefined;
  const all = await listRecords(formFilter);

  const wb = new ExcelJS.Workbook();
  wb.creator = "Phần mềm KSK trẻ em";
  wb.created = new Date();

  // Tạo 1 sheet cho mỗi loại mẫu (chỉ những mẫu có dữ liệu hoặc theo filter)
  const formsToExport = formFilter ? FORMS.filter((f) => f.id === formFilter) : FORMS;

  for (const form of formsToExport) {
    const rows = all.filter((r: KskRecord) => r.form_id === form.id);
    const fields = flatFields(form.id);

    const ws = wb.addWorksheet(form.code);

    // Header
    const header: string[] = ["ID", "Họ tên", "Ngày sinh"];
    if (form.id === "mau9") header.push("Điểm M-CHAT", "Phân loại nguy cơ");
    for (const f of fields) header.push(f.label);
    header.push("Người nhập", "Ngày tạo");
    ws.addRow(header);
    ws.getRow(1).font = { bold: true };
    ws.getRow(1).alignment = { vertical: "middle", wrapText: true };
    ws.views = [{ state: "frozen", ySplit: 1 }];

    // Data
    for (const r of rows) {
      const v = r.values || {};
      const line: (string | number)[] = [r.id, r.child_name, r.dob ?? ""];
      if (form.id === "mau9") {
        const score = r.mchat_score ?? 0;
        const phan = score >= 3 ? "Nên khám chuyên khoa" : score >= 1 ? "Nguy cơ thấp - theo dõi" : "Bình thường";
        line.push(score, phan);
      }
      for (const f of fields) line.push(cellValue(v[f.key]));
      line.push(r.created_by ?? "");
      line.push(r.created_at ? new Date(r.created_at).toLocaleString("vi-VN") : "");
      ws.addRow(line);
    }

    // Độ rộng cột
    ws.columns.forEach((col, i) => {
      if (i < 3) col.width = 18;
      else col.width = 22;
    });
  }

  const buffer = await wb.xlsx.writeBuffer();
  const name = `ksk-tre-em-${new Date().toISOString().slice(0, 10)}.xlsx`;
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${name}"`,
    },
  });
}
