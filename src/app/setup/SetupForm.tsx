"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, full_name: fullName, password }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Khởi tạo thất bại");
      router.push("/");
      router.refresh();
    } catch (e) {
      setErr(String(e instanceof Error ? e.message : e));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="field-label">Họ và tên</label>
        <input className="text-input" value={fullName} onChange={(e) => setFullName(e.target.value)} autoFocus />
      </div>
      <div>
        <label className="field-label">Tên đăng nhập</label>
        <input className="text-input" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label className="field-label">Mật khẩu (≥ 6 ký tự)</label>
        <input type="password" className="text-input" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {err && <p className="text-sm text-rose-600">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full px-4 py-2 rounded-md bg-brand-600 text-white font-medium disabled:opacity-60"
      >
        {busy ? "Đang tạo..." : "Tạo tài khoản quản trị"}
      </button>
    </form>
  );
}
