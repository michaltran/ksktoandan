import type { Field, Section, RadioField, YesNoField } from "./schema";

// ---- Helpers tạo field nhanh ----
export const BT = "Bình thường";
export const KBT = "Không bình thường";

export function radioBT(key: string, label: string, hint?: string): RadioField {
  return { key, label, kind: "radio", options: [BT, KBT], normal: BT, hint };
}
export function radioKoCo(key: string, label: string, hint?: string): RadioField {
  // Không (bình thường) / Có (bất thường)
  return { key, label, kind: "radio", options: ["Không", "Có"], normal: "Không", hint };
}
export function radioCoKo(key: string, label: string, hint?: string): RadioField {
  return { key, label, kind: "radio", options: ["Có", "Không"], normal: "Không", hint };
}
export function radio(
  key: string,
  label: string,
  options: string[],
  normal?: string,
  hint?: string
): RadioField {
  return { key, label, kind: "radio", options, normal, hint };
}
export function yes(key: string, label: string): YesNoField {
  return { key, label, kind: "yesno" };
}
export function note(key: string, label = "Ghi chú thêm"): Field {
  return { key, label, kind: "textarea", placeholder: "Nhập ghi chú nếu có..." };
}

// =========================================================
// HÀNH CHÍNH
// =========================================================
function adminCore(): Field[] {
  return [
    { key: "hc_hoten", label: "Họ và tên (IN HOA)", kind: "text" },
    { key: "hc_ngaysinh", label: "Sinh ngày", kind: "text", placeholder: "dd/mm/yyyy" },
    { key: "hc_sinhnon", label: "Sinh non", kind: "radio", options: ["Có", "Không"], normal: "Không" },
    { key: "hc_tuanthai", label: "Tuần thai khi sinh", kind: "text", placeholder: "vd: 38 tuần (hoặc KB)" },
    { key: "hc_gioitinh", label: "Giới tính", kind: "radio", options: ["Nam", "Nữ"] },
    { key: "hc_dantoc", label: "Dân tộc", kind: "text" },
    { key: "hc_noio", label: "Nơi ở", kind: "text" },
    { key: "hc_nguoidicung", label: "Họ tên người đi cùng trẻ", kind: "text" },
    {
      key: "hc_moiquanhe",
      label: "Mối quan hệ với trẻ",
      kind: "radio",
      options: ["Cha", "Mẹ", "Ông/bà", "Anh/chị", "Họ hàng", "Khác"],
    },
  ];
}

// Hành chính đơn giản (Mẫu 2-7): có tiền sử bản thân / gia đình
export function adminSimple(): Section {
  return {
    id: "hanhchinh",
    title: "Hành chính",
    columns: 2,
    fields: [
      ...adminCore(),
      { key: "ts_banthan", label: "Tiền sử bản thân", kind: "textarea" },
      { key: "ts_giadinh", label: "Tiền sử gia đình", kind: "textarea" },
      radioCoKo("ts_lao", "Tiền sử tiếp xúc với người bệnh lao"),
    ],
  };
}

// Hành chính có thêm CCCD, trường lớp, SĐT (Mẫu 8)
export function adminSchool(): Section {
  return {
    id: "hanhchinh",
    title: "Hành chính",
    columns: 2,
    fields: [
      { key: "hc_hoten", label: "Họ và tên (IN HOA)", kind: "text" },
      { key: "hc_cccd", label: "Mã định danh (CCCD)", kind: "text" },
      { key: "hc_ngaysinh", label: "Sinh ngày", kind: "text", placeholder: "dd/mm/yyyy" },
      { key: "hc_sinhnon", label: "Sinh non", kind: "radio", options: ["Có", "Không"], normal: "Không" },
      { key: "hc_tuanthai", label: "Tuần thai khi sinh", kind: "text", placeholder: "vd: 38 tuần (hoặc KB)" },
      { key: "hc_gioitinh", label: "Giới tính", kind: "radio", options: ["Nam", "Nữ"] },
      { key: "hc_dantoc", label: "Dân tộc", kind: "text" },
      { key: "hc_noio", label: "Nơi ở", kind: "text" },
      { key: "hc_truonglop", label: "Trường lớp (nếu có)", kind: "text" },
      { key: "hc_nguoidicung", label: "Họ tên người đi cùng trẻ", kind: "text" },
      { key: "hc_sodienthoai", label: "Số điện thoại", kind: "text" },
      {
        key: "hc_moiquanhe",
        label: "Mối quan hệ với trẻ",
        kind: "radio",
        options: ["Cha", "Mẹ", "Ông/bà", "Anh/chị", "Họ hàng", "Khác"],
      },
      { key: "ts_banthan", label: "Tiền sử bản thân", kind: "textarea" },
      { key: "ts_giadinh", label: "Tiền sử gia đình", kind: "textarea" },
      radioCoKo("ts_lao", "Tiền sử tiếp xúc với người bệnh lao"),
    ],
  };
}

// Hành chính sơ sinh đầy đủ (Mẫu 1): tiền sử mẹ, thai kỳ, sinh, sàng lọc, dinh dưỡng
export function adminNeonatal(): Section {
  return {
    id: "hanhchinh",
    title: "Hành chính & Tiền sử",
    columns: 2,
    fields: [
      ...adminCore(),
      // Tiền sử mẹ
      { key: "tsm_para", label: "Tiền sử mẹ — PARA", kind: "text" },
      { key: "tsm_batthuong_thaiky_truoc", label: "Bất thường trong thai kỳ trước", kind: "textarea" },
      { key: "tsm_benhly_thaiky", label: "Bệnh lý trong thai kỳ", kind: "textarea" },
      { key: "tsm_thuoc_mangthai", label: "Thuốc uống trong lúc mang thai", kind: "textarea" },
      { key: "tsm_sangloc_truocsinh", label: "Bệnh lý mẹ sàng lọc trước sinh", kind: "textarea" },
      // Tiền sử trẻ
      { key: "tst_kieusinh", label: "Kiểu sinh", kind: "radio", options: ["Sinh thường", "Sinh mổ"] },
      {
        key: "tst_sausinh",
        label: "Tình trạng của trẻ sau sinh",
        kind: "radio",
        options: ["Da kề da và nằm với mẹ đến khi ra viện", "Điều trị tại Khoa sơ sinh"],
      },
      { key: "tst_benhly_sausinh", label: "Bệnh lý của trẻ sau sinh (ghi rõ)", kind: "textarea" },
      {
        key: "tst_sangloc_sosinh",
        label: "Sàng lọc sơ sinh",
        kind: "checklist",
        options: ["Máu gót chân", "Thính lực", "Tim bẩm sinh"],
      },
      {
        key: "tst_dinhduong",
        label: "Dinh dưỡng",
        kind: "radio",
        options: ["Bú mẹ hoàn toàn", "Bú mẹ + sữa công thức (SCT)", "SCT hoàn toàn"],
      },
      radioCoKo("ts_lao", "Tiền sử tiếp xúc với người bệnh lao"),
    ],
  };
}

// =========================================================
// DẤU HIỆU SINH TỒN
// =========================================================
export function vitals(): Section {
  return {
    id: "sinhton",
    title: "Đánh giá dấu hiệu sinh tồn",
    columns: 2,
    quickFill: "normal",
    fields: [
      { key: "st_nhietdo", label: "Nhiệt độ", kind: "number", unit: "độ C", step: 0.1 },
      radioBT("st_nhietdo_dg", "Đánh giá nhiệt độ"),
      { key: "st_mach", label: "Mạch", kind: "number", unit: "lần/phút" },
      radioBT("st_mach_dg", "Đánh giá mạch"),
      { key: "st_nhiptho", label: "Nhịp thở", kind: "number", unit: "lần/phút" },
      radioBT("st_nhiptho_dg", "Đánh giá nhịp thở"),
    ],
  };
}

// =========================================================
// DINH DƯỠNG
// =========================================================
// Dùng "Chiều dài" cho trẻ nhỏ (Mẫu 1-7), kèm vòng cánh tay & vòng đầu.
export function nutritionInfant(includeArm = true): Section {
  const fields: Field[] = [
    { key: "dd_chieudai", label: "Chiều dài", kind: "number", unit: "cm", step: 0.1 },
    { key: "dd_chieudai_sd", label: "Chiều dài/Tuổi (SD)", kind: "text" },
    { key: "dd_cannang", label: "Cân nặng", kind: "number", unit: "kg", step: 0.1 },
    { key: "dd_cannang_sd", label: "Cân nặng/Tuổi (SD)", kind: "text" },
  ];
  if (includeArm) {
    fields.push({ key: "dd_vongcanhtay", label: "Chu vi vòng cánh tay", kind: "number", unit: "mm" });
  }
  fields.push({ key: "dd_vongdau", label: "Vòng đầu", kind: "number", unit: "cm", step: 0.1 });
  fields.push({
    key: "dd_danhgia",
    label: "Đánh giá dinh dưỡng",
    kind: "checklist",
    options: [
      "Phù dinh dưỡng",
      "Dấu hiệu thiếu máu",
      "Dấu hiệu còi xương",
      "Suy dinh dưỡng",
      "Thừa cân/béo phì",
    ],
  });
  return { id: "dinhduong", title: "Đánh giá dinh dưỡng", columns: 2, fields };
}

// Mẫu 1: thêm đánh giá vòng đầu (đầu to/bình thường/đầu nhỏ)
export function nutritionMau1(): Section {
  return {
    id: "dinhduong",
    title: "Đánh giá dinh dưỡng",
    columns: 2,
    fields: [
      { key: "dd_chieudai", label: "Chiều dài", kind: "number", unit: "cm", step: 0.1 },
      { key: "dd_chieudai_sd", label: "Chiều dài/Tuổi (SD)", kind: "text" },
      { key: "dd_cannang", label: "Cân nặng", kind: "number", unit: "kg", step: 0.1 },
      { key: "dd_cannang_sd", label: "Cân nặng/Tuổi (SD)", kind: "text" },
      { key: "dd_vongdau", label: "Vòng đầu", kind: "number", unit: "cm", step: 0.1 },
      {
        key: "dd_vongdau_dg",
        label: "Đánh giá vòng đầu",
        kind: "radio",
        options: ["Đầu to", "Bình thường", "Đầu nhỏ"],
        normal: "Bình thường",
      },
    ],
  };
}

// Mẫu 8 (2-<6 tuổi): dùng Chiều cao, không vòng cánh tay / vòng đầu
export function nutritionChild(): Section {
  return {
    id: "dinhduong",
    title: "Đánh giá dinh dưỡng",
    columns: 2,
    fields: [
      { key: "dd_chieucao", label: "Chiều cao", kind: "number", unit: "cm", step: 0.1 },
      { key: "dd_chieucao_sd", label: "Chiều cao/Tuổi (SD)", kind: "text" },
      { key: "dd_cannang", label: "Cân nặng", kind: "number", unit: "kg", step: 0.1 },
      { key: "dd_cannang_sd", label: "Cân nặng/Tuổi (SD)", kind: "text" },
      {
        key: "dd_danhgia",
        label: "Đánh giá dinh dưỡng",
        kind: "checklist",
        options: ["Phù dinh dưỡng", "Suy dinh dưỡng", "Thừa cân, béo phì"],
      },
    ],
  };
}

// =========================================================
// PHÁT TRIỂN TINH THẦN - VẬN ĐỘNG (mốc theo tuổi)
// =========================================================
export function development(items: string[], title = "Đánh giá phát triển tinh thần - vận động"): Section {
  return {
    id: "phattrien",
    title,
    description: "Hành vi & năng lực trẻ độ tuổi này thường làm được (chọn Có/Không).",
    quickFill: "yes",
    columns: 1,
    fields: items.map((label, i) => yes(`pt_${i + 1}`, label)),
  };
}

// =========================================================
// TIÊM CHỦNG
// =========================================================
export function vaccines(items: string[]): Section {
  return {
    id: "tiemchung",
    title: "Đánh giá tiêm chủng (kiểm tra sổ tiêm chủng)",
    description: "Đã tiêm/uống: chọn Có; chưa: chọn Không.",
    quickFill: "yes",
    columns: 1,
    fields: [
      ...items.map((label, i) => yes(`tc_${i + 1}`, label)),
      { key: "tc_khac", label: "Khác (ghi rõ)", kind: "text" },
    ],
  };
}

// =========================================================
// TƯ VẤN (sau phần đánh giá, trước khám lâm sàng)
// =========================================================
export function counsel(): Section {
  return {
    id: "tuvan",
    title: "Tư vấn",
    fields: [{ key: "tuvan_danhgia", label: "Nội dung tư vấn", kind: "textarea" }],
  };
}

// =========================================================
// KẾT LUẬN VÀ TƯ VẤN
// =========================================================
export function conclusion(): Section {
  return {
    id: "ketluan",
    title: "Kết luận và tư vấn",
    fields: [
      {
        key: "kl_suckhoe",
        label: "Kết luận về sức khỏe",
        kind: "radio",
        options: [
          "Bình thường",
          "Có nguy cơ mắc lao (tiền sử tiếp xúc)",
          "Có vấn đề về sức khỏe",
        ],
        normal: "Bình thường",
      },
      { key: "kl_ghiro", label: "Ghi rõ vấn đề sức khỏe (nếu có)", kind: "textarea" },
      { key: "kl_tuvan_hen", label: "Tư vấn và hẹn khám lần sau", kind: "textarea" },
    ],
  };
}
