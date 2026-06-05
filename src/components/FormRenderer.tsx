"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormDef, Field, Section, RecordValues } from "@/lib/forms/schema";

// Tính giá trị mặc định: radio có "normal" -> chọn sẵn giá trị bình thường
function buildDefaults(form: FormDef): RecordValues {
  const v: RecordValues = {};
  for (const s of form.sections) {
    for (const f of s.fields) {
      if (f.kind === "radio" && f.normal) v[f.key] = f.normal;
      else if (f.kind === "checklist") v[f.key] = [];
      else if (f.kind === "checkbox") v[f.key] = false;
      else v[f.key] = "";
    }
  }
  return v;
}


export default function FormRenderer({
  form,
  initialValues,
  recordId,
}: {
  form: FormDef;
  initialValues?: RecordValues;
  recordId?: number;
}) {
  const router = useRouter();
  const defaults = useMemo(() => buildDefaults(form), [form]);
  const [values, setValues] = useState<RecordValues>({ ...defaults, ...(initialValues ?? {}) });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function set(key: string, val: string | string[] | boolean | null) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  // M-CHAT điểm trực tiếp
  const mchatScore = useMemo(() => {
    if (form.id !== "mau9") return null;
    let score = 0;
    for (let n = 1; n <= 20; n++) {
      const ans = values[`mchat_${n}`];
      if (ans == null || ans === "") continue;
      const riskYes = n === 2 || n === 5 || n === 12;
      if (riskYes ? ans === "Có" : ans === "Không") score += 1;
    }
    return score;
  }, [form.id, values]);

  function fillSection(section: Section, mode: "normal" | "yes") {
    setValues((prev) => {
      const next = { ...prev };
      for (const f of section.fields) {
        if (mode === "yes" && f.kind === "yesno") next[f.key] = "Có";
        if (mode === "normal" && f.kind === "radio" && f.normal) next[f.key] = f.normal;
      }
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(recordId ? `/api/records/${recordId}` : "/api/records", {
        method: recordId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form_id: form.id, values }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Lỗi lưu");
      setMsg("Đã lưu thành công ✓");
      router.push("/records?form=" + form.id);
      router.refresh();
    } catch (e) {
      setMsg("Lỗi: " + String(e));
      setSaving(false);
    }
  }

  return (
    <div className="pb-24">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">
          {form.code} — {form.name}
        </h1>
        <p className="text-sm text-slate-500">Độ tuổi: {form.ageRange}</p>
      </div>

      {form.sections.map((section) => (
        <SectionView
          key={section.id}
          section={section}
          values={values}
          set={set}
          onFill={fillSection}
        />
      ))}

      {/* Thanh lưu cố định */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          {mchatScore !== null && (
            <div className="text-sm">
              <span className="font-medium">Tổng điểm M-CHAT: </span>
              <span
                className={
                  "font-bold " + (mchatScore >= 3 ? "text-rose-600" : mchatScore >= 1 ? "text-amber-600" : "text-emerald-600")
                }
              >
                {mchatScore}
              </span>
              <span className="text-slate-500">
                {" "}
                — {mchatScore >= 3 ? "Nên khám chuyên khoa" : mchatScore >= 1 ? "Nguy cơ thấp, theo dõi" : "Bình thường"}
              </span>
            </div>
          )}
          {msg && <span className="text-sm text-slate-600">{msg}</span>}
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => router.push("/records")}
              className="px-4 py-2 rounded-md border border-slate-300 text-sm"
            >
              Hủy
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2 rounded-md bg-brand-600 text-white text-sm font-medium disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : recordId ? "Cập nhật" : "Lưu hồ sơ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionView({
  section,
  values,
  set,
  onFill,
}: {
  section: Section;
  values: RecordValues;
  set: (k: string, v: string | string[] | boolean | null) => void;
  onFill: (s: Section, mode: "normal" | "yes") => void;
}) {
  const colClass =
    section.columns === 3
      ? "grid-cols-1 md:grid-cols-3"
      : section.columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1";

  return (
    <section className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="font-semibold text-slate-800">{section.title}</h2>
          {section.description && <p className="text-xs text-slate-500 mt-0.5">{section.description}</p>}
        </div>
        {section.quickFill && (
          <button
            onClick={() => onFill(section, section.quickFill!)}
            className="shrink-0 text-xs px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200"
          >
            {section.quickFill === "yes" ? "Tất cả Có ✓" : "Tất cả bình thường ✓"}
          </button>
        )}
      </div>
      <div className={`grid ${colClass} gap-x-6 gap-y-4`}>
        {section.fields.map((f) => (
          <FieldView key={f.key} field={f} value={values[f.key]} set={set} />
        ))}
      </div>
    </section>
  );
}

function FieldView({
  field,
  value,
  set,
}: {
  field: Field;
  value: string | string[] | boolean | null | undefined;
  set: (k: string, v: string | string[] | boolean | null) => void;
}) {
  const wide = field.kind === "textarea" || field.kind === "yesno";

  if (field.kind === "text") {
    return (
      <div className={wide ? "md:col-span-2" : ""}>
        <label className="field-label">{field.label}</label>
        <input
          className="text-input"
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => set(field.key, e.target.value)}
        />
      </div>
    );
  }

  if (field.kind === "textarea") {
    return (
      <div className="md:col-span-2">
        <label className="field-label">{field.label}</label>
        <textarea
          className="text-input min-h-[60px]"
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => set(field.key, e.target.value)}
        />
      </div>
    );
  }

  if (field.kind === "number") {
    return (
      <div>
        <label className="field-label">
          {field.label} {field.unit && <span className="text-slate-400">({field.unit})</span>}
        </label>
        <input
          type="number"
          step={field.step ?? "any"}
          className="text-input"
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => set(field.key, e.target.value)}
        />
      </div>
    );
  }

  if (field.kind === "checkbox") {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => set(field.key, e.target.checked)}
          className="h-4 w-4"
        />
        <span className="text-sm">{field.label}</span>
      </label>
    );
  }

  if (field.kind === "checklist") {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="md:col-span-2">
        <label className="field-label">{field.label}</label>
        <div className="flex flex-wrap gap-2">
          {field.options.map((opt) => {
            const active = arr.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                data-active={active}
                className="seg-btn"
                onClick={() => {
                  const next = active ? arr.filter((x) => x !== opt) : [...arr, opt];
                  set(field.key, next);
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Còn lại: radio + yesno -> segmented buttons
  if (field.kind !== "radio" && field.kind !== "yesno") return null;
  const options = field.kind === "yesno" ? ["Có", "Không"] : field.options;
  // Giá trị "tốt": yesno -> "Có"; radio -> giá trị normal nếu có
  const goodValue = field.kind === "yesno" ? "Có" : field.normal;
  return (
    <div className={field.kind === "yesno" ? "md:col-span-2" : ""}>
      <label className="field-label">{field.label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          const tone = active ? (goodValue ? (opt === goodValue ? "good" : "bad") : undefined) : undefined;
          return (
            <button
              key={opt}
              type="button"
              data-active={active}
              data-tone={tone}
              className="seg-btn"
              onClick={() => set(field.key, value === opt ? "" : opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
