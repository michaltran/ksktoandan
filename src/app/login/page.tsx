import { redirect } from "next/navigation";
import { Suspense } from "react";
import { countUsers } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Chưa có tài khoản nào -> sang trang khởi tạo
  if ((await countUsers()) === 0) redirect("/setup");
  // Đã đăng nhập -> về trang chủ
  if (await getCurrentUser()) redirect("/");

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white border border-slate-200 rounded-lg p-6">
      <h1 className="text-xl font-bold text-slate-900 mb-1">Đăng nhập</h1>
      <p className="text-sm text-slate-500 mb-4">Phần mềm KSK Trẻ em</p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
