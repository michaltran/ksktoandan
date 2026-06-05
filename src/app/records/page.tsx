import Link from "next/link";
import { listRecords } from "@/lib/db";
import { FORMS, getForm } from "@/lib/forms/definitions";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function RecordsPage({
  searchParams,
}: {
  searchParams: { form?: string; q?: string };
}) {
  const formId = searchParams.form;
  const q = searchParams.q ?? "";
  const records = await listRecords(formId, q);

  const exportHref = formId ? `/api/export?form=${formId}` : "/api/export";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Danh sách hồ sơ</h1>
        <a href={exportHref} className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium">
          ⬇️ Xuất Excel{formId ? ` (${getForm(formId)?.code})` : " (tất cả)"}
        </a>
      </div>

      {/* Tìm kiếm theo tên */}
      <form method="get" className="flex gap-2 mb-3">
        {formId && <input type="hidden" name="form" value={formId} />}
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Tìm theo họ tên trẻ..."
          className="text-input max-w-xs"
        />
        <button type="submit" className="px-4 py-2 rounded-md bg-brand-600 text-white text-sm font-medium">
          Tìm
        </button>
        {q && (
          <Link
            href={formId ? `/records?form=${formId}` : "/records"}
            className="px-4 py-2 rounded-md border border-slate-300 text-sm"
          >
            Xóa lọc
          </Link>
        )}
      </form>

      {/* Bộ lọc theo mẫu */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          href="/records"
          className={`text-sm px-3 py-1.5 rounded-md border ${!formId ? "bg-brand-600 text-white border-brand-600" : "bg-white border-slate-300"}`}
        >
          Tất cả
        </Link>
        {FORMS.map((f) => (
          <Link
            key={f.id}
            href={`/records?form=${f.id}`}
            className={`text-sm px-3 py-1.5 rounded-md border ${
              formId === f.id ? "bg-brand-600 text-white border-brand-600" : "bg-white border-slate-300"
            }`}
          >
            {f.code}
          </Link>
        ))}
      </div>

      {records.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500">
          Chưa có hồ sơ nào. <Link href="/" className="text-brand-600 underline">Nhập hồ sơ mới</Link>.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-2 font-medium">ID</th>
                <th className="text-left px-4 py-2 font-medium">Mẫu</th>
                <th className="text-left px-4 py-2 font-medium">Họ tên</th>
                <th className="text-left px-4 py-2 font-medium">Ngày sinh</th>
                <th className="text-left px-4 py-2 font-medium">M-CHAT</th>
                <th className="text-left px-4 py-2 font-medium">Người nhập</th>
                <th className="text-left px-4 py-2 font-medium">Ngày tạo</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-2 text-slate-400">#{r.id}</td>
                  <td className="px-4 py-2">{getForm(r.form_id)?.code ?? r.form_id}</td>
                  <td className="px-4 py-2 font-medium">{r.child_name || <span className="text-slate-400">(chưa có tên)</span>}</td>
                  <td className="px-4 py-2">{r.dob || "—"}</td>
                  <td className="px-4 py-2">
                    {r.mchat_score == null ? (
                      "—"
                    ) : (
                      <span className={r.mchat_score >= 3 ? "text-rose-600 font-semibold" : r.mchat_score >= 1 ? "text-amber-600" : "text-emerald-600"}>
                        {r.mchat_score}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-slate-500">{r.created_by || "—"}</td>
                  <td className="px-4 py-2 text-slate-500">
                    {r.created_at ? new Date(r.created_at).toLocaleString("vi-VN") : "—"}
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <Link href={`/records/${r.id}/print`} className="text-slate-600 hover:underline mr-3">
                      In
                    </Link>
                    <Link href={`/records/${r.id}`} className="text-brand-600 hover:underline mr-3">
                      Sửa
                    </Link>
                    <DeleteButton id={r.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
