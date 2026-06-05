import Link from "next/link";
import { FORMS } from "@/lib/forms/definitions";
import { storageMode } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const mode = storageMode();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Chọn mẫu phiếu để nhập liệu</h1>
        <p className="text-sm text-slate-500 mt-1">
          9 mẫu giấy khám sức khỏe trẻ em. Bấm vào mẫu phù hợp với độ tuổi của trẻ để bắt đầu.
        </p>
        {mode === "local" && (
          <p className="mt-2 text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-3 py-2 inline-block">
            ⚠️ Đang chạy chế độ lưu tạm cục bộ (file). Hãy cấu hình <code>DATABASE_URL</code> (Neon) để lưu lên cơ sở dữ liệu.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FORMS.map((f) => (
          <Link
            key={f.id}
            href={`/forms/${f.id}`}
            className="block bg-white rounded-lg border border-slate-200 p-4 hover:border-brand-500 hover:shadow-sm transition"
          >
            <div className="text-xs font-semibold text-brand-600">{f.code}</div>
            <div className="font-medium text-slate-800 mt-1 leading-snug">{f.name}</div>
            <div className="text-sm text-slate-500 mt-2">📅 {f.ageRange}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/records" className="px-4 py-2 rounded-md border border-slate-300 text-sm">
          📋 Xem danh sách hồ sơ đã nhập
        </Link>
        <a href="/api/export" className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium">
          ⬇️ Xuất tất cả ra Excel
        </a>
      </div>
    </div>
  );
}
