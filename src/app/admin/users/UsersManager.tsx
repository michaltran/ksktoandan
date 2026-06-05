"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface U {
  id: number;
  username: string;
  full_name: string;
  role: string;
}

export default function UsersManager({ initialUsers, meId }: { initialUsers: U[]; meId: number }) {
  const router = useRouter();
  const [users, setUsers] = useState<U[]>(initialUsers);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    const r = await fetch("/api/auth/users");
    const d = await r.json();
    if (d.ok) setUsers(d.users);
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, full_name: fullName, password, role }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setUsername("");
      setFullName("");
      setPassword("");
      setRole("user");
      await reload();
    } catch (e) {
      setErr(String(e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Xóa người dùng này?")) return;
    await fetch(`/api/auth/users/${id}`, { method: "DELETE" });
    await reload();
    router.refresh();
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Tên đăng nhập</th>
              <th className="text-left px-4 py-2 font-medium">Họ tên</th>
              <th className="text-left px-4 py-2 font-medium">Vai trò</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium">{u.username}</td>
                <td className="px-4 py-2">{u.full_name}</td>
                <td className="px-4 py-2">{u.role === "admin" ? "Quản trị" : "Nhân viên"}</td>
                <td className="px-4 py-2 text-right">
                  {u.id !== meId && (
                    <button onClick={() => remove(u.id)} className="text-rose-600 hover:underline">
                      Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={add} className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 h-fit">
        <h2 className="font-semibold text-slate-800">Thêm người dùng</h2>
        <div>
          <label className="field-label">Họ và tên</label>
          <input className="text-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Tên đăng nhập</label>
          <input className="text-input" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Mật khẩu (≥ 6 ký tự)</label>
          <input type="password" className="text-input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Vai trò</label>
          <select className="text-input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Nhân viên</option>
            <option value="admin">Quản trị</option>
          </select>
        </div>
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full px-4 py-2 rounded-md bg-brand-600 text-white font-medium disabled:opacity-60"
        >
          {busy ? "Đang thêm..." : "Thêm người dùng"}
        </button>
      </form>
    </div>
  );
}
