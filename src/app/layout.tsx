import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import UserMenu from "@/components/UserMenu";

export const metadata: Metadata = {
  title: "Phần mềm nhập liệu Khám sức khỏe trẻ em",
  description: "Nhập liệu các mẫu giấy khám sức khỏe cho trẻ em và xuất Excel",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="vi">
      <body>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-brand-700">
              🩺 KSK Trẻ em
            </Link>
            {user && (
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/" className="hover:text-brand-600">
                  Trang chủ
                </Link>
                <Link href="/records" className="hover:text-brand-600">
                  Danh sách hồ sơ
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin/users" className="hover:text-brand-600">
                    Người dùng
                  </Link>
                )}
                <UserMenu name={user.full_name || user.username} />
              </nav>
            )}
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
