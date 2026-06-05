"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`Xóa hồ sơ #${id}?`)) return;
    setBusy(true);
    await fetch(`/api/records/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={onDelete} disabled={busy} className="text-rose-600 hover:underline disabled:opacity-50">
      {busy ? "..." : "Xóa"}
    </button>
  );
}
