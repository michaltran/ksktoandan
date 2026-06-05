import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listUsers } from "@/lib/db";
import UsersManager from "./UsersManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== "admin") redirect("/");

  const users = (await listUsers()).map((u) => ({
    id: u.id,
    username: u.username,
    full_name: u.full_name,
    role: u.role,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Quản lý người dùng</h1>
      <UsersManager initialUsers={users} meId={me.id} />
    </div>
  );
}
