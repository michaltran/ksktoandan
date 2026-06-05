"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 rounded-md bg-brand-600 text-white text-sm font-medium print:hidden"
    >
      🖨️ In / Lưu PDF
    </button>
  );
}
