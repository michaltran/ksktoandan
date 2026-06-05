import { notFound } from "next/navigation";
import Link from "next/link";
import { getRecord } from "@/lib/db";
import { getForm } from "@/lib/forms/definitions";
import type { Field } from "@/lib/forms/schema";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

function display(field: Field, v: unknown): string {
  if (field.kind === "checkbox") return v ? "Có" : "Không";
  if (Array.isArray(v)) return v.length ? v.join("; ") : "—";
  if (v == null || v === "") return "—";
  return String(v);
}

export default async function PrintRecordPage({ params }: { params: { id: string } }) {
  const rec = await getRecord(Number(params.id));
  if (!rec) notFound();
  const form = getForm(rec.form_id);
  if (!form) notFound();
  const values = (rec.values || {}) as Record<string, unknown>;

  return (
    <div className="max-w-3xl mx-auto bg-white">
      <div className="flex items-center justify-between mb-4 print:hidden">
        <Link href="/records" className="text-sm text-brand-600 hover:underline">
          ← Quay lại danh sách
        </Link>
        <PrintButton />
      </div>

      <div className="text-center mb-5">
        <h1 className="text-lg font-bold uppercase">{form.name}</h1>
        <p className="text-sm text-slate-600">Độ tuổi áp dụng: {form.ageRange}</p>
        {form.id === "mau9" && rec.mchat_score != null && (
          <p className="text-sm mt-1">
            <strong>Tổng điểm M-CHAT: {rec.mchat_score}</strong>{" "}
            ({rec.mchat_score >= 3 ? "Nên khám chuyên khoa" : rec.mchat_score >= 1 ? "Nguy cơ thấp, theo dõi" : "Bình thường"})
          </p>
        )}
      </div>

      {form.sections.map((section) => (
        <section key={section.id} className="mb-4 break-inside-avoid">
          <h2 className="font-semibold text-slate-800 border-b border-slate-300 pb-1 mb-2">{section.title}</h2>
          <table className="w-full text-sm">
            <tbody>
              {section.fields.map((f) => (
                <tr key={f.key} className="align-top">
                  <td className="py-1 pr-3 text-slate-600 w-1/2">{f.label}</td>
                  <td className="py-1 font-medium">{display(f, values[f.key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <div className="mt-6 text-sm text-slate-500">
        <p>Ngày tạo: {rec.created_at ? new Date(rec.created_at).toLocaleString("vi-VN") : "—"}</p>
      </div>

      <div className="mt-10 flex justify-end gap-16 text-center text-sm print:mt-16">
        <div>
          <p className="font-medium">Người khám</p>
          <p className="text-slate-400 mt-12">(Ký, ghi rõ họ tên)</p>
        </div>
      </div>
    </div>
  );
}
