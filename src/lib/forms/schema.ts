// ===== Kiểu dữ liệu mô tả phiếu khám =====
// Mỗi phiếu (Mẫu) gồm nhiều "section" (mục), mỗi mục gồm nhiều "field" (trường).
// Toàn bộ giao diện nhập liệu được sinh tự động từ các định nghĩa này,
// nhờ vậy đảm bảo có ĐẦY ĐỦ tất cả các trường của mẫu phiếu gốc.

export type FieldKind =
  | "text" // ô chữ 1 dòng
  | "textarea" // ô chữ nhiều dòng (ghi chú, mô tả, tư vấn)
  | "number" // số (nhiệt độ, cân nặng...)
  | "radio" // chọn 1 trong nhiều (vd: Bình thường / Không bình thường)
  | "select" // danh sách thả xuống (vd: phường/xã địa giới)
  | "checkbox" // 1 ô tick độc lập (boolean)
  | "checklist" // chọn nhiều trong danh sách (vd: các dấu hiệu dinh dưỡng)
  | "yesno"; // Có / Không (dùng cho mốc phát triển, tiêm chủng, M-CHAT)

export interface BaseField {
  key: string; // khóa duy nhất trong phiếu, dùng làm cột khi xuất Excel
  label: string;
  kind: FieldKind;
  hint?: string; // gợi ý nhỏ hiển thị dưới nhãn
}

export interface TextField extends BaseField {
  kind: "text" | "textarea";
  placeholder?: string;
  default?: string; // giá trị điền sẵn
  readOnly?: boolean; // chỉ đọc (vd: tỉnh/thành cố định)
}

export interface SelectField extends BaseField {
  kind: "select";
  options: string[];
  default?: string;
}

export interface NumberField extends BaseField {
  kind: "number";
  unit?: string; // đơn vị: độ C, lần/phút, cm, kg...
  placeholder?: string;
  step?: number;
}

export interface RadioField extends BaseField {
  kind: "radio";
  options: string[];
  normal?: string; // giá trị "bình thường" -> dùng cho nút "Tất cả bình thường" & mặc định
}

export interface CheckboxField extends BaseField {
  kind: "checkbox";
}

export interface ChecklistField extends BaseField {
  kind: "checklist";
  options: string[];
}

export interface YesNoField extends BaseField {
  kind: "yesno";
  // riskAnswer: với M-CHAT, câu trả lời mang ý nghĩa nguy cơ (để tính điểm)
  riskAnswer?: "Có" | "Không";
}

export type Field =
  | TextField
  | NumberField
  | RadioField
  | SelectField
  | CheckboxField
  | ChecklistField
  | YesNoField;

export interface Section {
  id: string;
  title: string;
  description?: string;
  columns?: 1 | 2 | 3; // số cột bố cục các field
  fields: Field[];
  // Loại nhóm để hiển thị nút thao tác nhanh phù hợp
  quickFill?: "normal" | "yes"; // "normal": nút Tất cả bình thường; "yes": nút Tất cả Có
}

export interface FormDef {
  id: string; // mau1, mau2, ...
  code: string; // "Mẫu 1"
  name: string; // tên đầy đủ
  ageRange: string; // "0 - dưới 2 tháng tuổi"
  ageMinMonths: number; // dùng để gợi ý phiếu theo ngày sinh
  ageMaxMonths: number;
  sections: Section[];
}

// Giá trị nhập của 1 bản ghi: { fieldKey: value }
// value có thể là string (text/radio/yesno/number), string[] (checklist), boolean (checkbox)
export type RecordValues = Record<string, string | string[] | boolean | null>;
