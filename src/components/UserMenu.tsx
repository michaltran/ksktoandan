"use client";

import { useRouter } from "next/navigation";

export default function UserMenu({ name }: { name: string }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-500">👤 {name}</span>
      <button onClick={logout} className="px-2.5 py-1 rounded-md border border-slate-300 hover:bg-slate-50">
        Đăng xuất
      </button>
    </div>
  );
}
