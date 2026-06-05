import { redirect } from "next/navigation";
import { countUsers } from "@/lib/db";
import SetupForm from "./SetupForm";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  if ((await countUsers()) > 0) redirect("/login");

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white border border-slate-200 rounded-lg p-6">
      <h1 className="text-xl font-bold text-slate-900 mb-1">Khởi tạo hệ thống</h1>
      <p className="text-sm text-slate-500 mb-4">Tạo tài khoản quản trị đầu tiên để bắt đầu sử dụng.</p>
      <SetupForm />
    </div>
  );
}
