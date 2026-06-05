import type { Field, Section } from "./schema";
import { radioBT, radioKoCo, radio, BT, KBT } from "./common";

// ============================================================
// KHÁM LÂM SÀNG — Mẫu 1 (sơ sinh 0 - <2 tháng): đầy đủ & chi tiết nhất
// ============================================================
export function examMau1(): Section {
  const fields: Field[] = [
    // Toàn trạng
    radio("kls_motmat", "Toàn trạng — Trẻ mở mắt tự nhiên", ["Có", "Không"], "Có"),
    radio("kls_mausacda", "Màu sắc da", ["Hồng hào", "Nhợt", "Tím", "Vàng", "Sạm da"], "Hồng hào"),
    radio("kls_sangthuongda", "Sang thương da", ["Không", "Xuất huyết", "Bóng nước", "Khác"], "Không"),
    { key: "kls_motasangthuong", label: "Mô tả sang thương (nếu có)", kind: "textarea" },
    // Đầu - cổ
    radio("kls_thop", "Đầu cổ — Thóp", [BT, "Rộng", "Hẹp", "Thóp phồng"], BT),
    radioBT("kls_hinhdangdau", "Hình dạng đầu"),
    radio("kls_vandongco", "Vận động cổ", [BT, "Giới hạn"], BT),
    radioKoCo("kls_khoibatthuong_dau", "Khối bất thường (đầu - cổ)"),
    // Mắt
    radio("kls_vitri2mat", "Khám mắt — Vị trí 2 mắt", [BT, "2 mắt xa nhau"], BT),
    radio("kls_mimat", "Mí mắt và kết mạc", [BT, "Sưng/đỏ", "Chảy ghèn/mủ"], BT),
    radioBT("kls_dongtu", "Đồng tử (kích thước, phản xạ)"),
    radio("kls_redreflex", "Phản xạ Red reflex", [BT, "Bất thường (P)", "Bất thường (T)"], BT),
    // Tai
    radio("kls_vitritai", "Khám tai — Vị trí tai", [BT, "Tai đóng thấp"], BT),
    radio("kls_soluongtai", "Số lượng tai", ["Đủ 2 bên tai", "Bất thường"], "Đủ 2 bên tai"),
    { key: "kls_soluongtai_ghichu", label: "Bất thường tai bên (ghi rõ)", kind: "text" },
    radioKoCo("kls_suongsautai", "Có khối sưng sau tai"),
    radioKoCo("kls_chamu_tai", "Dấu hiệu chảy mủ, nước tai"),
    // Mũi
    radio("kls_hinhdangmui", "Khám mũi — Hình dạng mũi", [BT, "Mũi to, dày", "Bất sản xương mũi"], BT),
    // Miệng
    radio("kls_hinhdangmieng", "Khám miệng — Hình dạng", [BT, "Sứt môi, chẻ vòm"], BT),
    radioKoCo("kls_rangsua", "Răng sữa sơ sinh"),
    radio("kls_hinhdangluoi", "Hình dạng lưỡi", [BT, "Lưỡi to bè"], BT),
    radioKoCo("kls_dinhthangluoi", "Dính thắng lưỡi"),
    radioKoCo("kls_nammieng", "Nấm miệng"),
    radioKoCo("kls_camnho", "Cằm nhỏ, tụt về sau"),
    // Hô hấp
    radio("kls_nhipthokhongdeu", "Hô hấp — Nhịp thở không đều", ["Không", "Có cơn ngưng thở trên 5 giây"], "Không"),
    radioKoCo("kls_rutlomngucsosinh", "Thở rút lõm lồng ngực"),
    radioKoCo("kls_tiengthobatthuong", "Tiếng thở bất thường"),
    radioBT("kls_nghephoi", "Nghe phổi"),
    // Tim mạch
    { key: "kls_spo2", label: "Tim mạch — Đo SpO2", kind: "number", unit: "%" },
    radio("kls_spo2_dg", "Đánh giá SpO2", [BT, "Dưới < 95%"], BT),
    radioBT("kls_momtim", "Vị trí mỏm tim"),
    radioKoCo("kls_odapbatthuong", "Ổ đập bất thường"),
    radio("kls_machngoaivi", "Mạch ngoại vi (quay - bẹn)", ["Bắt rõ", "Mạch nhẹ", "Không bắt được"], "Bắt rõ"),
    radio("kls_tiengtim", "Tiếng tim", ["Đều, rõ, không âm thổi", "Không đều"], "Đều, rõ, không âm thổi"),
    {
      key: "kls_tiengtim_batthuong",
      label: "Bất thường tiếng tim",
      kind: "checklist",
      options: ["Tiếng tim bất thường", "Âm thổi", "Rung miêu"],
    },
    // Bụng và cơ quan sinh dục
    radioBT("kls_hinhdangbung", "Bụng — Hình dáng bụng, rốn"),
    radioKoCo("kls_ganlach", "Gan, lách to"),
    radioKoCo("kls_khoibatthuong_bung", "Khối bất thường (bụng)"),
    radioKoCo("kls_lohaumon", "Lỗ hậu môn (bất thường)"),
    radioKoCo("kls_sinhduc_nam", "Cơ quan sinh dục nam (thoát vị bẹn, tinh hoàn ẩn)"),
    radioBT("kls_sinhduc_nu", "Cơ quan sinh dục nữ"),
    // Lưng và cột sống
    radio("kls_cotsong", "Lưng & cột sống — Hình dạng cột sống", ["Toàn vẹn, cân đối", "Hở cột sống", "Vẹo cột sống"], "Toàn vẹn, cân đối"),
    // Cơ xương và thần kinh
    radioKoCo("kls_vandongkhongdoixung", "Cơ xương & thần kinh — Vận động không đối xứng"),
    radio("kls_phanxabu", "Phản xạ bú", ["Có", "Không"], "Có"),
    radio("kls_phanxanam", "Phản xạ nắm", ["Có", "Không"], "Có"),
    radio("kls_phanxamoro", "Phản xạ Moro", ["Có", "Không"], "Có"),
    radio("kls_truonglucco", "Trương lực cơ", [BT, "Tăng", "Giảm"], BT),
    radio("kls_khophang", "Khớp háng", [BT, "Trật khớp háng"], BT),
    { key: "kls_ghichu", label: "Ghi chú khám lâm sàng", kind: "textarea" },
  ];
  return {
    id: "khamlamsang",
    title: "Khám lâm sàng",
    description:
      "Quan sát: nét mặt/tư thế/tỷ lệ, sự đối xứng các bộ phận cơ thể/sự chuyển động của trẻ. Tìm dấu hiệu bệnh cấp hoặc mạn tính.",
    quickFill: "normal",
    columns: 2,
    fields,
  };
}

// ============================================================
// KHÁM LÂM SÀNG — Mẫu 2 (2 - 3 tháng)
// ============================================================
export function examMau2(): Section {
  const fields: Field[] = [
    // Da
    radio("kls_longbantay", "Da — Lòng bàn tay", ["Không nhợt", "Nhợt"], "Không nhợt"),
    radioKoCo("kls_loro_da", "Các lỗ rò trên da (rò luân nhĩ, rò xoang bì)"),
    radioKoCo("kls_vangdakeodai", "Vàng da kéo dài"),
    // Đầu cổ
    { key: "kls_dauco_note", label: "Khám đầu - cổ (ghi chú)", kind: "textarea" },
    // Mắt
    radioBT("kls_mimat", "Khám mắt — Mí mắt và kết mạc"),
    radioKoCo("kls_runggiat", "Rung giật nhãn cầu / lác / vận động mắt bất thường"),
    radioBT("kls_dongtu", "Đồng tử (kích thước, phản xạ)"),
    // Tai
    radioBT("kls_dapungamthanh", "Khám tai — Đáp ứng với âm thanh"),
    radioKoCo("kls_suongsautai", "Có khối sưng sau tai"),
    radioKoCo("kls_chamu_tai", "Dấu hiệu chảy mủ, nước tai"),
    // Miệng
    radioBT("kls_khammieng", "Khám miệng"),
    // Hô hấp
    radioKoCo("kls_suyhohap", "Hô hấp — Dấu hiệu suy hô hấp"),
    radioKoCo("kls_tiengthobatthuong", "Tiếng thở bất thường"),
    radioBT("kls_nghephoi", "Nghe phổi"),
    // Tim mạch
    radioBT("kls_momtim", "Tim mạch — Vị trí mỏm tim"),
    radioBT("kls_machngoaivi", "Mạch ngoại vi (quay - bẹn)"),
    radioKoCo("kls_nghetim", "Nghe tim (rối loạn nhịp tim, tiếng thổi)"),
    // Bụng
    radioBT("kls_hinhdangbung", "Bụng — Hình dáng bụng, rốn"),
    radioKoCo("kls_ganlach", "Gan, lách to"),
    radioKoCo("kls_khoibatthuong_bung", "Khối bất thường (bụng)"),
    radioKoCo("kls_sinhduc_nam", "Cơ quan sinh dục nam (thoát vị bẹn, tinh hoàn ẩn)"),
    radioBT("kls_sinhduc_nu", "Cơ quan sinh dục nữ"),
    // Cơ xương thần kinh
    radioKoCo("kls_vandongkhongdoixung", "Cơ xương & thần kinh — Vận động không đối xứng"),
    radioBT("kls_phanxaco", "Phản xạ cơ"),
    radioKoCo("kls_truonglucco_bt", "Trương lực cơ bất thường"),
    radioBT("kls_khophang", "Khớp háng"),
    radioKoCo("kls_coixuong", "Dấu hiệu còi xương"),
    { key: "kls_ghichu", label: "Ghi chú khám lâm sàng", kind: "textarea" },
  ];
  return {
    id: "khamlamsang",
    title: "Khám lâm sàng",
    description:
      "Quan sát: nét mặt/tư thế/tỷ lệ, sự đối xứng các bộ phận cơ thể/sự chuyển động của trẻ. Tìm dấu hiệu bệnh cấp hoặc mạn tính.",
    quickFill: "normal",
    columns: 2,
    fields,
  };
}

// ============================================================
// KHÁM LÂM SÀNG — Mẫu 3..7 (có tham số tùy biến theo mẫu)
// ============================================================
interface StdExamOpts {
  ear: "mangnhi" | "taimangnhi"; // Mẫu 3 dùng "Màng nhĩ + Đáp ứng âm thanh"
  mouth: "mieng" | "muihong"; // Mẫu 3: Khám miệng; còn lại: Khám mũi họng + răng miệng
  genital: "namnu" | "ngoai"; // Mẫu 3: nam & nữ; còn lại: sinh dục ngoài
  musculo: "mau3" | "mau45" | "mau67";
}

export function examStandard(opts: StdExamOpts): Section {
  const fields: Field[] = [
    // Da
    radioBT("kls_da", "Da"),
    radio("kls_longbantay", "Lòng bàn tay", ["Bình thường (không nhợt)", "Không bình thường (nhợt)"], "Bình thường (không nhợt)"),
    // Đầu - cổ
    radioBT("kls_thop", "Đầu cổ — Thóp"),
    radioBT("kls_kichthuocdau", "Kích thước và hình dạng đầu"),
    radioKoCo("kls_khoibatthuong_dau", "Khối bất thường (đầu - cổ)"),
    // Mắt
    radioBT("kls_mimat", "Khám mắt — Mí mắt và kết mạc"),
    radioKoCo("kls_runggiat", "Rung giật nhãn cầu / lác / vận động mắt bất thường"),
    radioBT("kls_dongtu", "Đồng tử (kích thước, phản xạ)"),
  ];

  // Tai
  if (opts.ear === "mangnhi") {
    fields.push(radioBT("kls_mangnhi", "Khám tai — Màng nhĩ"));
    fields.push(radioBT("kls_dapungamthanh", "Đáp ứng với âm thanh"));
  } else {
    fields.push(radioBT("kls_taimangnhi", "Khám tai — Tai và màng nhĩ"));
  }
  fields.push(radioKoCo("kls_suongsautai", "Có khối sưng sau tai"));
  fields.push(radioKoCo("kls_chamu_tai", "Dấu hiệu chảy mủ, nước tai"));

  // Miệng / mũi họng
  if (opts.mouth === "mieng") {
    fields.push(radioBT("kls_khammieng", "Khám miệng"));
  } else {
    fields.push(radioBT("kls_muihong", "Khám mũi họng"));
    fields.push(radioKoCo("kls_rangmieng", "Bất thường răng miệng"));
  }

  // Hô hấp
  fields.push(radioKoCo("kls_suyhohap", "Hô hấp — Dấu hiệu suy hô hấp"));
  fields.push(radioKoCo("kls_tiengthobatthuong", "Tiếng thở bất thường"));
  fields.push(radioBT("kls_nghephoi", "Nghe phổi"));
  // Tim mạch
  fields.push(radioBT("kls_momtim", "Tim mạch — Vị trí mỏm tim"));
  fields.push(radioBT("kls_machngoaivi", "Mạch ngoại vi (quay - bẹn)"));
  fields.push(radioKoCo("kls_nghetim", "Nghe tim (rối loạn nhịp tim, tiếng thổi)"));
  // Bụng và cơ quan sinh dục
  fields.push(radioBT("kls_hinhdangbung", "Bụng — Hình dáng bụng, rốn"));
  fields.push(radioKoCo("kls_ganlach", "Gan, lách to"));
  fields.push(radioKoCo("kls_khoibatthuong_bung", "Khối bất thường (bụng)"));
  if (opts.genital === "namnu") {
    fields.push(radioBT("kls_sinhduc_nam", "Cơ quan sinh dục nam"));
    fields.push(radioBT("kls_sinhduc_nu", "Cơ quan sinh dục nữ"));
  } else {
    fields.push(radioBT("kls_sinhduc_ngoai", "Cơ quan sinh dục ngoài"));
  }

  // Cơ xương và thần kinh
  fields.push(radioKoCo("kls_vandongkhongdoixung", "Cơ xương & thần kinh — Vận động không đối xứng"));
  if (opts.musculo === "mau3") {
    fields.push(radioBT("kls_phanxaco", "Phản xạ cơ"));
    fields.push(radioKoCo("kls_truonglucco_bt", "Trương lực cơ bất thường"));
    fields.push(radioBT("kls_khophang", "Khớp háng"));
    fields.push(radioKoCo("kls_coixuong", "Dấu hiệu còi xương"));
  } else if (opts.musculo === "mau45") {
    fields.push(radioBT("kls_truonglucco", "Trương lực cơ"));
    fields.push(radioBT("kls_phanxaco", "Phản xạ cơ"));
    fields.push(radioKoCo("kls_coixuong", "Dấu hiệu còi xương"));
  } else {
    // mau67
    fields.push(radioBT("kls_truonglucco", "Trương lực cơ"));
    fields.push(radioBT("kls_phanxaco", "Phản xạ cơ"));
    fields.push(radioBT("kls_kiemtralung", "Kiểm tra lưng"));
    fields.push(radioBT("kls_tuchikhop", "Khám tứ chi và khớp"));
    fields.push(radioBT("kls_dangdi", "Quan sát dáng đi"));
  }
  fields.push({ key: "kls_ghichu", label: "Ghi chú khám lâm sàng", kind: "textarea" });

  return {
    id: "khamlamsang",
    title: "Khám lâm sàng",
    description:
      "Quan sát: nét mặt/tư thế/tỷ lệ, sự đối xứng các bộ phận cơ thể/sự chuyển động của trẻ. Tìm dấu hiệu bệnh cấp hoặc mạn tính.",
    quickFill: "normal",
    columns: 2,
    fields,
  };
}

// ============================================================
// KHÁM LÂM SÀNG — Mẫu 8 (2 - <6 tuổi): chi tiết cho trẻ lớn
// ============================================================
export function examMau8(): Section {
  const fields: Field[] = [
    // Da
    radioBT("kls_da", "Da"),
    radio("kls_longbantay", "Lòng bàn tay", ["Bình thường (không nhợt)", "Không bình thường (nhợt)"], "Bình thường (không nhợt)"),
    {
      key: "kls_batthuongda",
      label: "Bất thường về da",
      kind: "checklist",
      options: ["Chàm", "Ghẻ", "Nấm", "Bướu máu", "Dấu xuất huyết"],
    },
    // Đầu - cổ
    radio("kls_toc", "Đầu cổ — Tóc", [BT, "Rụng tóc"], BT),
    radioBT("kls_kichthuocdau", "Kích thước và hình dạng đầu"),
    radioKoCo("kls_khoibatthuong_dau", "Khối bất thường (đầu - cổ)"),
    // Mắt
    radioBT("kls_mimat", "Khám mắt — Mí mắt và kết mạc"),
    radioKoCo("kls_lacmat", "Lác mắt"),
    radioKoCo("kls_khongnhintheo", "Không nhìn theo đồ vật"),
    radioBT("kls_dongtu", "Đồng tử (kích thước, phản xạ)"),
    // Tai
    radioBT("kls_taimangnhi", "Khám tai — Tai và màng nhĩ"),
    radioBT("kls_dapungamthanh", "Đáp ứng với âm thanh"),
    radioKoCo("kls_suongsautai", "Có khối sưng sau tai"),
    radioKoCo("kls_chamu_tai", "Dấu hiệu chảy mủ, nước tai"),
    // Mũi họng
    radioKoCo("kls_chaynuocmui", "Mũi họng — Chảy nước mũi"),
    radioKoCo("kls_nghetmui", "Nghẹt mũi"),
    radioBT("kls_hong", "Họng"),
    // Răng miệng
    radioKoCo("kls_nammieng", "Răng miệng — Nấm miệng"),
    radioKoCo("kls_saurang", "Vết sâu, mảng bám, lỗ trên răng"),
    radioKoCo("kls_loetmieng", "Vết loét ở niêm mạc miệng"),
    // Hô hấp
    radioKoCo("kls_suyhohap", "Hô hấp — Dấu hiệu suy hô hấp"),
    radioKoCo("kls_tiengthobatthuong", "Tiếng thở bất thường"),
    radioBT("kls_nghephoi", "Nghe phổi"),
    // Tim mạch
    radioBT("kls_momtim", "Tim mạch — Vị trí mỏm tim"),
    radioBT("kls_machngoaivi", "Mạch ngoại vi (quay - bẹn)"),
    radioKoCo("kls_nghetim", "Nghe tim (rối loạn nhịp tim, tiếng thổi)"),
    // Bụng
    radioBT("kls_hinhdangbung", "Bụng — Hình dáng bụng, rốn"),
    radioKoCo("kls_ganlach", "Gan, lách to"),
    radioKoCo("kls_khoibatthuong_bung", "Khối bất thường (bụng)"),
    radioKoCo("kls_taobon", "Táo bón"),
    radioKoCo("kls_tieuchay", "Tiêu chảy kéo dài"),
    radioBT("kls_sinhduc_ngoai", "Cơ quan sinh dục ngoài"),
    // Cơ xương thần kinh
    radioKoCo("kls_vandongkhongdoixung", "Cơ xương & thần kinh — Vận động không đối xứng"),
    radioBT("kls_truonglucco", "Trương lực cơ"),
    radioBT("kls_phanxaco", "Phản xạ cơ"),
    radioBT("kls_kiemtralung", "Kiểm tra lưng"),
    radioBT("kls_tuchikhop", "Khám tứ chi và khớp"),
    radioBT("kls_dangdi", "Quan sát dáng đi"),
    { key: "kls_ghichu", label: "Ghi chú khám lâm sàng", kind: "textarea" },
  ];
  return {
    id: "khamlamsang",
    title: "Khám lâm sàng",
    description:
      "Quan sát: nét mặt/tư thế/tỷ lệ, sự đối xứng các bộ phận cơ thể/sự chuyển động của trẻ. Tìm dấu hiệu bệnh cấp hoặc mạn tính.",
    quickFill: "normal",
    columns: 2,
    fields,
  };
}
