"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormDef, Field, Section, RecordValues } from "@/lib/forms/schema";
import type { FormOption } from "@/lib/forms/definitions";

// Tính giá trị mặc định: radio có "normal" -> chọn sẵn giá trị bình thường
function buildDefaults(form: FormDef): RecordValues {
  const v: RecordValues = {};
  for (const s of form.sections) {
    for (const f of s.fields) {
      if (f.kind === "radio" && f.normal) v[f.key] = f.normal;
      else if (f.kind === "select" && f.default) v[f.key] = f.default;
      else if ((f.kind === "text" || f.kind === "textarea") && f.default) v[f.key] = f.default;
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
  formList = [],
}: {
  form: FormDef;
  initialValues?: RecordValues;
  recordId?: number;
  formList?: FormOption[];
}) {
  const router = useRouter();
  const defaults = useMemo(() => buildDefaults(form), [form]);
  const [values, setValues] = useState<RecordValues>({ ...defaults, ...(initialValues ?? {}) });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Đưa con trỏ về trường nhập đầu tiên
  function focusFirst() {
    setTimeout(() => {
      const el = containerRef.current?.querySelector<HTMLElement>("[data-kbd]");
      el?.focus();
    }, 40);
  }

  function set(key: string, val: string | string[] | boolean | null) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  // Chuyển focus sang trường nhập kế tiếp (theo thứ tự xuất hiện trên trang)
  function focusNext(el: HTMLElement) {
    const root = containerRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-kbd]"));
    const idx = nodes.indexOf(el);
    if (idx >= 0 && idx + 1 < nodes.length) nodes[idx + 1].focus();
  }

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

  // thenNew = true: lưu xong mở phiếu trắng mới để nhập tiếp (chỉ với hồ sơ mới)
  async function save(thenNew: boolean) {
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

      if (!recordId && thenNew) {
        // Tự tạo phiếu mới: reset về mặc định, cuộn lên đầu, focus trường đầu
        setValues({ ...defaults });
        setSavedCount((c) => c + 1);
        setMsg("Đã lưu ✓ — nhập hồ sơ tiếp theo");
        setSaving(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        focusFirst();
      } else {
        setMsg("Đã lưu thành công ✓");
        router.push("/records?form=" + form.id);
        router.refresh();
      }
    } catch (e) {
      setMsg("Lỗi: " + String(e));
      setSaving(false);
    }
  }

  return (
    <div className="pb-24" ref={containerRef}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {form.code} — {form.name}
          </h1>
          <p className="text-sm text-slate-500">Độ tuổi: {form.ageRange}</p>
        </div>
        {formList.length > 0 && (
          <div className="shrink-0">
            <label className="block text-xs text-slate-500 mb-1">Chọn nhanh mẫu để nhập</label>
            <select
              className="text-input py-1.5"
              value={form.id}
              onChange={(e) => {
                if (e.target.value !== form.id) router.push(`/forms/${e.target.value}`);
              }}
            >
              {formList.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.code} — {f.ageRange}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Hướng dẫn phím tắt để nhập nhanh */}
      <div className="mb-4 text-xs bg-brand-50 border border-brand-100 text-brand-700 rounded-md px-3 py-2">
        ⌨️ <strong>Nhập nhanh bằng bàn phím:</strong> <kbd>Tab</kbd> chuyển trường ·{" "}
        ở ô lựa chọn bấm <kbd>1</kbd>/<kbd>2</kbd>/<kbd>3</kbd> để chọn (hoặc <kbd>C</kbd>=Có, <kbd>K</kbd>=Không) — tự
        nhảy sang trường kế · <kbd>←</kbd>/<kbd>→</kbd> đổi lựa chọn · <kbd>Enter</kbd> sang ô tiếp theo.
      </div>

      {form.sections.map((section) => (
        <SectionView
          key={section.id}
          section={section}
          values={values}
          set={set}
          onFill={fillSection}
          focusNext={focusNext}
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
                  "font-bold " +
                  (mchatScore >= 3 ? "text-rose-600" : mchatScore >= 1 ? "text-amber-600" : "text-emerald-600")
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
          {msg && <span className="text-sm font-medium text-emerald-700">{msg}</span>}
          {savedCount > 0 && (
            <span className="text-xs text-slate-500">Đã lưu {savedCount} hồ sơ trong phiên này</span>
          )}
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => router.push("/records?form=" + form.id)}
              className="px-4 py-2 rounded-md border border-slate-300 text-sm"
            >
              {recordId ? "Hủy" : "Xem danh sách"}
            </button>
            {recordId ? (
              <button
                onClick={() => save(false)}
                disabled={saving}
                className="px-5 py-2 rounded-md bg-brand-600 text-white text-sm font-medium disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Cập nhật"}
              </button>
            ) : (
              <>
                <button
                  onClick={() => save(false)}
                  disabled={saving}
                  className="px-4 py-2 rounded-md border border-brand-600 text-brand-700 text-sm font-medium disabled:opacity-60"
                >
                  Lưu & xong
                </button>
                <button
                  onClick={() => save(true)}
                  disabled={saving}
                  className="px-5 py-2 rounded-md bg-brand-600 text-white text-sm font-medium disabled:opacity-60"
                >
                  {saving ? "Đang lưu..." : "Lưu & nhập tiếp →"}
                </button>
              </>
            )}
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
  focusNext,
}: {
  section: Section;
  values: RecordValues;
  set: (k: string, v: string | string[] | boolean | null) => void;
  onFill: (s: Section, mode: "normal" | "yes") => void;
  focusNext: (el: HTMLElement) => void;
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
          <FieldView key={f.key} field={f} value={values[f.key]} set={set} focusNext={focusNext} />
        ))}
      </div>
    </section>
  );
}

function FieldView({
  field,
  value,
  set,
  focusNext,
}: {
  field: Field;
  value: string | string[] | boolean | null | undefined;
  set: (k: string, v: string | string[] | boolean | null) => void;
  focusNext: (el: HTMLElement) => void;
}) {
  // ---- select (dropdown) ----
  if (field.kind === "select") {
    return (
      <div>
        <label className="field-label">{field.label}</label>
        <select
          data-kbd
          className="text-input"
          value={(value as string) ?? ""}
          onChange={(e) => set(field.key, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              focusNext(e.currentTarget);
            }
          }}
        >
          <option value="">-- Chọn --</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // ---- text ----
  if (field.kind === "text") {
    return (
      <div>
        <label className="field-label">{field.label}</label>
        <input
          data-kbd
          className={"text-input" + (field.readOnly ? " bg-slate-100 text-slate-500" : "")}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          readOnly={field.readOnly}
          onChange={(e) => set(field.key, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              focusNext(e.currentTarget);
            }
          }}
        />
      </div>
    );
  }

  // ---- textarea ----
  if (field.kind === "textarea") {
    return (
      <div className="md:col-span-2">
        <label className="field-label">{field.label}</label>
        <textarea
          data-kbd
          className="text-input min-h-[60px]"
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => set(field.key, e.target.value)}
        />
      </div>
    );
  }

  // ---- number ----
  if (field.kind === "number") {
    return (
      <div>
        <label className="field-label">
          {field.label} {field.unit && <span className="text-slate-400">({field.unit})</span>}
        </label>
        <input
          data-kbd
          type="number"
          step={field.step ?? "any"}
          className="text-input"
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => set(field.key, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              focusNext(e.currentTarget);
            }
          }}
        />
      </div>
    );
  }

  // ---- checkbox ----
  if (field.kind === "checkbox") {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          data-kbd
          type="checkbox"
          checked={!!value}
          onChange={(e) => set(field.key, e.target.checked)}
          className="h-4 w-4"
        />
        <span className="text-sm">{field.label}</span>
      </label>
    );
  }

  // ---- checklist (chọn nhiều) ----
  if (field.kind === "checklist") {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    const toggle = (opt: string) => {
      const next = arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt];
      set(field.key, next);
    };
    return (
      <div className="md:col-span-2">
        <label className="field-label">
          {field.label} <span className="text-slate-400 font-normal">(phím 1-{field.options.length} để chọn)</span>
        </label>
        <div
          data-kbd
          tabIndex={0}
          className="flex flex-wrap gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400 p-0.5"
          onKeyDown={(e) => {
            const n = parseInt(e.key, 10);
            if (!isNaN(n) && n >= 1 && n <= field.options.length) {
              e.preventDefault();
              toggle(field.options[n - 1]);
            } else if (e.key === "Enter") {
              e.preventDefault();
              focusNext(e.currentTarget);
            }
          }}
        >
          {field.options.map((opt, i) => {
            const active = arr.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                tabIndex={-1}
                data-active={active}
                className="seg-btn"
                onClick={() => toggle(opt)}
              >
                <span className="text-slate-400 mr-1">{i + 1}</span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- radio + yesno -> nhóm nút chọn, điều khiển bằng bàn phím ----
  if (field.kind !== "radio" && field.kind !== "yesno") return null;
  const options = field.kind === "yesno" ? ["Có", "Không"] : field.options;
  const goodValue = field.kind === "yesno" ? "Có" : field.normal;
  const curIndex = options.indexOf((value as string) ?? "");

  const selectAndAdvance = (opt: string, el: HTMLElement) => {
    set(field.key, value === opt ? "" : opt);
    focusNext(el);
  };

  return (
    <div className={field.kind === "yesno" ? "md:col-span-2" : ""}>
      <label className="field-label">
        {field.label}{" "}
        <span className="text-slate-400 font-normal">{field.kind === "yesno" ? "(C/K)" : `(1-${options.length})`}</span>
      </label>
      <div
        data-kbd
        tabIndex={0}
        className="flex flex-wrap gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400 p-0.5"
        onKeyDown={(e) => {
          const el = e.currentTarget;
          // Mũi tên: duyệt lựa chọn (không nhảy trường)
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            const ni = curIndex < 0 ? 0 : Math.min(curIndex + 1, options.length - 1);
            set(field.key, options[ni]);
            return;
          }
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            const ni = curIndex <= 0 ? 0 : curIndex - 1;
            set(field.key, options[ni]);
            return;
          }
          // Phím tắt Có/Không
          if (field.kind === "yesno" && (e.key === "c" || e.key === "C")) {
            e.preventDefault();
            selectAndAdvance("Có", el);
            return;
          }
          if (field.kind === "yesno" && (e.key === "k" || e.key === "K")) {
            e.preventDefault();
            selectAndAdvance("Không", el);
            return;
          }
          // Phím số chọn lựa chọn thứ N
          const n = parseInt(e.key, 10);
          if (!isNaN(n) && n >= 1 && n <= options.length) {
            e.preventDefault();
            selectAndAdvance(options[n - 1], el);
            return;
          }
          if (e.key === "Enter") {
            e.preventDefault();
            focusNext(el);
          }
        }}
      >
        {options.map((opt, i) => {
          const active = value === opt;
          const tone = active ? (goodValue ? (opt === goodValue ? "good" : "bad") : undefined) : undefined;
          return (
            <button
              key={opt}
              type="button"
              tabIndex={-1}
              data-active={active}
              data-tone={tone}
              className="seg-btn"
              onClick={() => set(field.key, value === opt ? "" : opt)}
            >
              <span className={active ? "opacity-70 mr-1" : "text-slate-400 mr-1"}>{i + 1}</span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
