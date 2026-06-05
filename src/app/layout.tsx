import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phần mềm nhập liệu Khám sức khỏe trẻ em",
  description: "Nhập liệu các mẫu giấy khám sức khỏe cho trẻ em và xuất Excel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-brand-700">
              🩺 KSK Trẻ em
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="hover:text-brand-600">
                Trang chủ
              </Link>
              <Link href="/records" className="hover:text-brand-600">
                Danh sách hồ sơ
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
