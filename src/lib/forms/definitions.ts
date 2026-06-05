import type { FormDef, Section } from "./schema";
import {
  adminSimple,
  adminSchool,
  adminNeonatal,
  vitals,
  nutritionInfant,
  nutritionMau1,
  nutritionChild,
  development,
  vaccines,
  counsel,
  conclusion,
} from "./common";
import { examMau1, examMau2, examStandard, examMau8 } from "./exams";

// Danh sách vắc xin dùng lại nhiều mẫu
const V_VGB1 = "Viêm gan B mũi 1 (sơ sinh)";
const V_LAO = "Lao (sơ sinh)";
const V_5IN1_1 = "Bạch hầu - Ho gà - Uốn ván - Viêm gan B - Hib (vắc xin 5 trong 1) mũi 1";
const V_5IN1_2 = "Bạch hầu - Ho gà - Uốn ván - Viêm gan B - Hib (vắc xin 5 trong 1) mũi 2";
const V_5IN1_3 = "Bạch hầu - Ho gà - Uốn ván - Viêm gan B - Hib (vắc xin 5 trong 1) mũi 3";
const V_BL1 = "Uống vắc xin bại liệt lần 1";
const V_BL2 = "Uống vắc xin bại liệt lần 2";
const V_BL3 = "Uống vắc xin bại liệt lần 3";
const V_IPV = "Tiêm vắc xin bại liệt IPV";
const V_SOI9 = "Sởi đơn (9 tháng)";
const V_VNNB1 = "Viêm não Nhật Bản mũi 1";
const V_VNNB2 = "Viêm não Nhật Bản mũi 2";
const V_5IN1_4 = "Bạch hầu - Ho gà - Uốn ván - Viêm gan B - Hib (vắc xin 5 trong 1) mũi 4 (18 tháng)";
const V_MR18 = "Sởi - Rubella (MR - 18 tháng)";

// ---------- MẪU 1: 0 - <2 tháng ----------
const mau1: FormDef = {
  id: "mau1",
  code: "Mẫu 1",
  name: "Giấy khám sức khỏe cho trẻ 0 - dưới 2 tháng tuổi",
  ageRange: "0 - dưới 2 tháng tuổi",
  ageMinMonths: 0,
  ageMaxMonths: 2,
  sections: [
    adminNeonatal(),
    vitals(),
    nutritionMau1(),
    development([
      "Trẻ vận động tay, chân đồng đều cả 2 bên khi nằm",
      "Trẻ quay đầu hướng về âm thanh như tiếng chuông, tiếng nhạc, lời nói của bố mẹ",
      "Bắt đầu có thể phát ra tiếng ê, a, gừ",
      "Nhìn theo khuôn mặt của bố/mẹ/người chăm sóc với khoảng cách 30cm",
    ]),
    vaccines([V_VGB1, V_LAO]),
    counsel(),
    examMau1(),
    conclusion(),
  ],
};

// ---------- MẪU 2: 2 - 3 tháng ----------
const mau2: FormDef = {
  id: "mau2",
  code: "Mẫu 2",
  name: "Giấy khám sức khỏe cho trẻ 2 - 3 tháng tuổi",
  ageRange: "2 - 3 tháng tuổi",
  ageMinMonths: 2,
  ageMaxMonths: 4,
  sections: [
    adminSimple(),
    vitals(),
    nutritionInfant(),
    development([
      "Phát ra tiếng khàn khàn, gừ gừ",
      "Cười mỉm",
      "Nhấc được đầu khi nằm sấp",
      "Trẻ ngoan/yên khi được vỗ về, hát ru, đung đưa",
      "Mắt nhìn theo đồ vật chuyển động",
    ]),
    vaccines([V_VGB1, V_LAO, V_5IN1_1, V_BL1]),
    counsel(),
    examMau2(),
    conclusion(),
  ],
};

// ---------- MẪU 3: 4 - 6 tháng ----------
const mau3: FormDef = {
  id: "mau3",
  code: "Mẫu 3",
  name: "Giấy khám sức khỏe cho trẻ 4 - 6 tháng tuổi",
  ageRange: "4 - 6 tháng tuổi",
  ageMinMonths: 4,
  ageMaxMonths: 7,
  sections: [
    adminSimple(),
    vitals(),
    nutritionInfant(),
    development([
      "Mắt nhìn theo đồ chơi và người đang di chuyển",
      "Biểu hiện sự thích thú với mọi người (cử động tay chân, phát ra tiếng…)",
      "Cười hoặc mỉm cười thể hiện sự thích thú",
      "Phát ra âm thanh khi vui vẻ hoặc không thoải mái",
      "Giữ đầu thẳng khi đỡ ngực trẻ hoặc khi đỡ trẻ ở tư thế ngồi",
      "Quay đầu về phía âm thanh, tiếng của cha mẹ",
      "Phát ra các âm thanh khi có người nói chuyện với trẻ",
      "Nhìn đồ vật, đưa tay hoặc với tay về phía đồ vật",
      "Cầm nắm được đồ vật trong tay",
      "Ngồi khi được giữ",
      "Biết lẫy",
    ]),
    vaccines([V_VGB1, V_LAO, V_5IN1_1, V_5IN1_2, V_5IN1_3, V_BL1, V_BL2, V_BL3, V_IPV]),
    counsel(),
    examStandard({ ear: "mangnhi", mouth: "mieng", genital: "namnu", musculo: "mau3" }),
    conclusion(),
  ],
};

// ---------- MẪU 4: 7 - 9 tháng ----------
const mau4: FormDef = {
  id: "mau4",
  code: "Mẫu 4",
  name: "Giấy khám sức khỏe cho trẻ 7 - 9 tháng tuổi",
  ageRange: "7 - 9 tháng tuổi",
  ageMinMonths: 7,
  ageMaxMonths: 10,
  sections: [
    adminSimple(),
    vitals(),
    nutritionInfant(),
    development([
      "Bập bẹ chuỗi âm thanh khác nhau (b b, ư, ơ)",
      "Phát ra âm thanh (khóc, la hét) hoặc cử chỉ để thu hút sự chú ý và đòi giúp đỡ",
      "Chơi các trò chơi tương tác với người chăm sóc (chạm mũi, ú òa)",
      "Quay đầu về phía tiếng gọi hoặc người nói chuyện",
      "Biết nhìn theo đồ vật bị giấu đi",
      "Nhận biết được lạ - quen",
      "Ngồi được không cần hỗ trợ",
      "Dùng ngón cái đối diện các ngón còn lại để túm, lấy đồ vật",
      "Đứng khi được xốc nách",
    ]),
    vaccines([V_VGB1, V_LAO, V_5IN1_1, V_5IN1_2, V_5IN1_3, V_BL1, V_BL2, V_BL3, V_IPV, V_SOI9]),
    counsel(),
    examStandard({ ear: "taimangnhi", mouth: "muihong", genital: "ngoai", musculo: "mau45" }),
    conclusion(),
  ],
};

// ---------- MẪU 5: 10 - 12 tháng ----------
const mau5: FormDef = {
  id: "mau5",
  code: "Mẫu 5",
  name: "Giấy khám sức khỏe cho trẻ 10 - 12 tháng tuổi",
  ageRange: "10 - 12 tháng tuổi",
  ageMinMonths: 10,
  ageMaxMonths: 13,
  sections: [
    adminSimple(),
    vitals(),
    nutritionInfant(),
    development([
      "Đáp ứng, quay về phía người gọi tên trẻ",
      "Hiểu một số câu hỏi đơn giản, quen thuộc (Quả bóng ở đâu? Bố đâu? Mẹ đâu?)",
      "Bập bẹ được một số từ gồm cả nguyên âm và phụ âm (ba, bà, ma, da, đi…)",
      "Bắt chước được một vài động tác: vỗ tay hoan hô, vẫy tay, lắc đầu, ú òa…",
      "Nhìn được đồ vật theo hướng tay của cha mẹ chỉ",
      "Lo lắng khi bị tách khỏi bố mẹ/người chăm sóc",
      "Đứng vịn được, biết đứng lên khi được kéo tay",
      "Có thể di chuyển hoặc lết bằng mông",
    ]),
    vaccines([
      V_VGB1, V_LAO, V_5IN1_1, V_5IN1_2, V_5IN1_3, V_BL1, V_BL2, V_BL3, V_IPV, V_SOI9, V_VNNB1, V_VNNB2,
    ]),
    counsel(),
    examStandard({ ear: "taimangnhi", mouth: "muihong", genital: "ngoai", musculo: "mau45" }),
    conclusion(),
  ],
};

// ---------- MẪU 6: 13 - 18 tháng ----------
const mau6: FormDef = {
  id: "mau6",
  code: "Mẫu 6",
  name: "Giấy khám sức khỏe cho trẻ 13 - 18 tháng tuổi",
  ageRange: "13 - 18 tháng tuổi",
  ageMinMonths: 13,
  ageMaxMonths: 19,
  sections: [
    adminSimple(),
    vitals(),
    nutritionInfant(),
    development([
      "Nói được từ 5-20 từ đơn có nghĩa, có chủ đích (VD: bố, mẹ, bà, xe, chó)",
      "Phát âm có thể chưa rõ ràng",
      "Biết dùng tay để cầm và ăn thức ăn cứng",
      "Sợ hãi khi tiếp xúc với người lạ hoặc đến nơi lạ",
      "Bắt chước được tiếng nói và cử chỉ của người khác",
      "Biết tìm đến bố mẹ/người chăm sóc thân thiết khi buồn, sợ hãi",
      "Thể hiện sự hứng thú với trẻ khác: nhìn, lại gần, cười, chơi cùng…",
      "Tự cởi mũ/dép mà không cần bố mẹ trợ giúp",
      "Biết bò/dò dẫm đi lên được 3-4 bậc cầu thang, tam cấp",
      "Làm được các yêu cầu đơn giản bằng lời nói không có chỉ dẫn (lấy được đồ vật/đồ chơi quen thuộc theo yêu cầu)",
      "Dùng ngón trỏ để chỉ cho người khác biết thứ mình muốn",
      "Trả lời hoặc quay đầu về phía người gọi tên trẻ",
      "Đi được khi có người dắt, bám vào thành tủ, giường để di chuyển (trẻ <15 tháng); đi mà không cần trợ giúp (trẻ 18 tháng)",
      "Cố gắng ngồi xổm để nhặt đồ chơi dưới sàn",
    ]),
    vaccines([
      V_VGB1, V_LAO, V_5IN1_1, V_5IN1_2, V_5IN1_3, V_BL1, V_BL2, V_BL3, V_IPV, V_SOI9, V_VNNB1, V_VNNB2, V_5IN1_4, V_MR18,
    ]),
    counsel(),
    examStandard({ ear: "taimangnhi", mouth: "muihong", genital: "ngoai", musculo: "mau67" }),
    conclusion(),
  ],
};

// ---------- MẪU 7: 19 - <24 tháng ----------
const mau7: FormDef = {
  id: "mau7",
  code: "Mẫu 7",
  name: "Giấy khám sức khỏe cho trẻ 19 - dưới 24 tháng tuổi",
  ageRange: "19 - dưới 24 tháng tuổi",
  ageMinMonths: 19,
  ageMaxMonths: 24,
  sections: [
    adminSimple(),
    vitals(),
    nutritionInfant(),
    development([
      "Chỉ được một vài bộ phận trên cơ thể",
      "Ăn bằng thìa mà ít rơi vãi",
      "Biết hợp tác với bố mẹ trong các hoạt động hàng ngày",
      "Trẻ bắt đầu tập chạy",
      "Nói được một vài từ ghép (2 từ) có ý nghĩa, có chủ đích (uống nước, ăn cơm, đi chơi)",
      "Làm được yêu cầu 1 hoặc 2 hành động liên tiếp theo yêu cầu của người khác (VD: bỏ cái bút vào cốc rồi đưa cho cô; lấy ô tô rồi đưa cho mẹ; vứt rác vào thùng rác)",
      "Đi lùi 2 bước mà không cần trợ giúp",
      "Biết cho đồ vật vào hộp hoặc lọ có miệng nhỏ",
    ]),
    vaccines([
      V_VGB1, V_LAO, V_5IN1_1, V_5IN1_2, V_5IN1_3, V_BL1, V_BL2, V_BL3, V_IPV, V_SOI9, V_VNNB1, V_VNNB2, V_5IN1_4, V_MR18,
    ]),
    counsel(),
    examStandard({ ear: "taimangnhi", mouth: "muihong", genital: "ngoai", musculo: "mau67" }),
    conclusion(),
  ],
};

// ---------- MẪU 8: 2 - <6 tuổi ----------
// Phần phát triển chia theo 4 nhóm tuổi nhỏ.
function devGroup(title: string, items: string[], idx: number): Section {
  const s = development(items, title);
  s.id = `phattrien_${idx}`;
  // đổi tiền tố key để không trùng giữa các nhóm tuổi
  s.fields = s.fields.map((f, i) => ({ ...f, key: `pt${idx}_${i + 1}` }));
  return s;
}

const mau8: FormDef = {
  id: "mau8",
  code: "Mẫu 8",
  name: "Giấy khám sức khỏe cho trẻ 2 - dưới 6 tuổi",
  ageRange: "2 - dưới 6 tuổi",
  ageMinMonths: 24,
  ageMaxMonths: 72,
  sections: [
    adminSchool(),
    vitals(),
    nutritionChild(),
    devGroup(
      "Phát triển tinh thần - vận động: 2 - <3 tuổi",
      [
        "Thực hiện được 2-3 yêu cầu liên tiếp (VD: lấy dép và đội mũ/cởi mũ, cởi giày và cất dép lên kệ)",
        "Nhận biết các hình, đồ vật, bộ phận cơ thể theo yêu cầu",
        "Nói được câu khoảng 4-5 từ; biết nói tên, tuổi của trẻ",
        "Chơi các trò chơi bắt chước (chơi nấu ăn, cho búp bê ăn…)",
        "Vịn cầu thang để bước lên các bậc, nhảy bật lên phía trước bằng cả 2 chân",
        "Đứng một chân khoảng 1 giây mà không cần vịn",
        "Cầm được bút vẽ đường thẳng, hình tròn; tô màu; cầm kéo cắt giấy",
        "Mở được nắp chai nước, vặn nắm cửa. Lật, mở từng trang sách",
        "Trẻ có thể dùng muỗng, thìa để tự ăn",
        "Tập trung nghe nhạc hoặc nghe đọc truyện trong thời gian từ 5-10 phút",
      ],
      1
    ),
    devGroup(
      "Phát triển tinh thần - vận động: 3 - <4 tuổi",
      [
        "Thực hiện được yêu cầu làm 3 hoạt động không liên quan (VD: cất đồ chơi vào thùng; đội mũ; đưa đồ vật cho bố mẹ)",
        "Nói được câu dài, bắt đầu thích kể chuyện (VD: Con đi chơi công viên; Con muốn ôm mẹ)",
        "Hỏi và trả lời được nhiều câu hỏi (VD: Tại sao? Con muốn đi đâu? Con muốn ăn gì?)",
        "Biết so sánh và đưa ra sự khác biệt (to hơn - nhỏ hơn; đẹp hơn - xấu hơn)",
        "Đứng yên bằng 1 chân khoảng 5 giây; tự tin lên xuống cầu thang bằng 2 chân, nhảy lò cò",
        "Có thể cài hoặc mở khuy áo, kéo khoá kéo, rửa tay",
        "Có thể cầm kéo, nặn, tô màu theo hình",
        "Trẻ tự ăn uống bằng thìa/muỗng; có thể tự lấy thức ăn không làm rơi vãi",
        "Tự mặc và cởi quần áo không cần hỗ trợ",
        "Nói đúng được các thông tin của bản thân: tên, tuổi, tên bố mẹ; số điện thoại",
        "Thể hiện cảm xúc rõ ràng và biết an ủi người khác khi họ buồn, lo lắng",
      ],
      2
    ),
    devGroup(
      "Phát triển tinh thần - vận động: 4 - <5 tuổi",
      [
        "Có thể đếm to hoặc đếm bằng ngón tay khi được hỏi (VD: có bao nhiêu quả táo trên bàn)",
        "Nói những câu hoàn chỉnh",
        "Biết ném và bắt bóng",
        "Có thể nhảy lò cò bằng 1 chân",
        "Tự mặc và cởi quần áo không cần hỗ trợ nhiều",
        "Hầu như luôn vâng lời người lớn",
        "Có thể tách rời bố mẹ hoặc người chăm sóc",
        "Kể lại được câu chuyện khi được nghe nhiều lần",
      ],
      3
    ),
    devGroup(
      "Phát triển tinh thần - vận động: 5 - <6 tuổi",
      [
        "Biết họ tên đầy đủ, tuổi, giới tính, địa chỉ nhà",
        "Nói rõ ràng, sử dụng câu dài và kể lại sự việc chi tiết",
        "Hiểu và làm theo nhiều hướng dẫn liên tiếp (4-5 bước)",
        "Nhận biết chữ cái, con số; có thể viết tên mình",
        "Đếm được đến 20 trở lên",
        "Vẽ người với nhiều chi tiết (tay, chân, quần áo, tóc…)",
        "Biết tự chăm sóc bản thân: mặc quần áo, đánh răng, buộc dây giày",
        "Vận động: chạy nhanh, nhảy xa, ném - bắt bóng tốt, đi thăng bằng",
        "Biết chơi trò chơi tập thể, tuân thủ luật lệ, chờ đến lượt",
      ],
      4
    ),
    vaccines([
      "Bạch hầu - Ho gà - Uốn ván - Bại liệt (nhắc lại)",
      "Sởi - Quai bị - Rubella (nhắc lại)",
      "Viêm gan B (nhắc lại)",
      "Viêm não Nhật Bản B (nhắc lại)",
      "Thuỷ đậu",
      "Cúm mùa",
    ]),
    counsel(),
    examMau8(),
    conclusion(),
  ],
};

// ---------- MẪU 9: M-CHAT-R (16 - 30 tháng) ----------
// 20 câu hỏi Có/Không. Câu 2, 5, 12: trả lời "Có" mang ý nghĩa nguy cơ.
const MCHAT_ITEMS = [
  "1. Nếu bạn chỉ vào một điểm trong phòng, con bạn có nhìn theo không? (VD: nếu bạn chỉ vào đồ chơi hay con vật, con bạn có nhìn vào đồ chơi/con vật đó không?)",
  "2. Bạn có bao giờ tự hỏi liệu con bạn có bị điếc không?",
  "3. Con bạn có chơi trò tưởng tượng hoặc giả vờ không? (VD: giả vờ uống nước từ cốc rỗng, giả vờ nói chuyện điện thoại, giả vờ cho búp bê/thú bông ăn)",
  "4. Con bạn có thích leo trèo lên đồ vật không? (VD: trèo lên đồ đạc, đồ chơi ngoài trời hoặc leo cầu thang)",
  "5. Con bạn có làm các cử động ngón tay một cách bất thường gần mắt của trẻ không? (VD: vẫy/đưa qua đưa lại ngón tay gần mắt)",
  "6. Con bạn có dùng ngón tay trỏ để yêu cầu việc gì đó, hoặc để muốn được giúp đỡ không? (VD: chỉ vào bim bim hoặc đồ chơi ngoài tầm với)",
  "7. Con bạn có dùng một ngón tay để chỉ cho bạn thứ gì đó thú vị mà trẻ thích thú không? (VD: chỉ vào máy bay trên bầu trời hoặc xe tải lớn trên đường)",
  "8. Con bạn có thích chơi với những đứa trẻ khác không? (VD: quan sát trẻ khác, cười với chúng hoặc tới chơi với chúng)",
  "9. Con bạn có khoe với bạn những đồ vật bằng cách cầm hoặc mang chúng đến cho bạn xem (không phải để được giúp mà chỉ để chia sẻ) không? (VD: khoe bông hoa, thú bông, xe tải đồ chơi)",
  "10. Con bạn có đáp lại khi được gọi tên không? (VD: ngước lên tìm người gọi, đáp chuyện hay bập bẹ, hoặc ngừng việc đang làm khi bạn gọi tên trẻ)",
  "11. Khi bạn cười với con bạn, con bạn có cười lại với bạn không?",
  "12. Con bạn có cảm thấy khó chịu bởi những tiếng ồn xung quanh? (VD: hét lên hay la khóc khi nghe tiếng máy hút bụi hoặc nhạc to)",
  "13. Con bạn có biết đi không?",
  "14. Con bạn có nhìn vào mắt bạn khi bạn đang nói chuyện, chơi cùng hoặc mặc quần áo cho trẻ không?",
  "15. Con bạn có bắt chước những điều bạn làm không? (VD: vẫy tay bye bye, vỗ tay, bắt chước tạo âm thanh vui vẻ)",
  "16. Nếu bạn quay đầu để nhìn gì đó, con bạn có nhìn xung quanh để xem bạn đang nhìn cái gì không?",
  "17. Con bạn có gây sự chú ý để bạn phải nhìn vào trẻ không? (VD: nhìn bạn để được khen ngợi hoặc nói “nhìn” hay “nhìn con”)",
  "18. Con bạn có hiểu bạn nói gì khi bạn yêu cầu con làm không? (VD: không chỉ tay, con bạn có hiểu “để sách lên ghế”, “đưa mẹ/bố cái chăn”)",
  "19. Nếu có điều gì mới lạ, con bạn có nhìn bạn để xem bạn cảm thấy thế nào về việc xảy ra không? (VD: nghe âm thanh lạ/thú vị, hay nhìn thấy đồ chơi mới, con bạn có nhìn bạn không?)",
  "20. Con bạn có thích những hoạt động mang tính chất chuyển động không? (VD: được lắc lư hoặc nhún nhảy trên đầu gối của bạn)",
];
const MCHAT_RISK_YES = new Set([2, 5, 12]); // các câu trả lời "Có" là nguy cơ

const mchatSection: Section = {
  id: "mchat",
  title: "Bảng câu hỏi M-CHAT-R",
  description:
    "Trả lời về hành vi thường gặp ở trẻ. Hành vi xảy ra rất ít (1-2 lần) coi như không có. Câu 2, 5, 12: trả lời “Có” mang ý nghĩa nguy cơ.",
  columns: 1,
  fields: MCHAT_ITEMS.map((label, i) => {
    const num = i + 1;
    return {
      key: `mchat_${num}`,
      label,
      kind: "yesno" as const,
      riskAnswer: MCHAT_RISK_YES.has(num) ? ("Có" as const) : ("Không" as const),
    };
  }),
};

const mau9: FormDef = {
  id: "mau9",
  code: "Mẫu 9",
  name: "Mẫu trắc nghiệm nguy cơ tự kỷ (M-CHAT-R)",
  ageRange: "16 - 30 tháng tuổi",
  ageMinMonths: 16,
  ageMaxMonths: 30,
  sections: [
    {
      id: "mchat_hanhchinh",
      title: "Thông tin chung",
      columns: 2,
      fields: [
        { key: "hc_hoten", label: "Họ tên trẻ", kind: "text" },
        { key: "hc_gioitinh", label: "Giới tính", kind: "radio", options: ["Nam", "Nữ"] },
        { key: "hc_ngaysinh", label: "Ngày sinh", kind: "text", placeholder: "dd/mm/yyyy" },
        { key: "mchat_tuoi", label: "Tuổi", kind: "text" },
        { key: "hc_noio", label: "Địa chỉ", kind: "text" },
        { key: "mchat_ngaydanhgia", label: "Ngày đánh giá", kind: "text", placeholder: "dd/mm/yyyy" },
        {
          key: "mchat_nguoidanhgia",
          label: "Người đánh giá",
          kind: "radio",
          options: ["Bố", "Mẹ", "Người chăm sóc khác"],
        },
        { key: "mchat_nguoidanhgia_khac", label: "Người chăm sóc khác (ghi rõ)", kind: "text" },
      ],
    },
    mchatSection,
    {
      id: "mchat_ketqua",
      title: "Kết quả",
      description:
        "Cách chấm: câu 2,5,12 trả lời “Có” = 1đ; các câu còn lại trả lời “Không” = 1đ. Tổng 1-2đ: nguy cơ thấp, theo dõi thêm và kiểm tra lại lúc 24 tháng. Từ 3đ trở lên: nên khám chuyên khoa. (Điểm tự động tính khi xuất/lưu.)",
      fields: [{ key: "mchat_ghichu", label: "Nhận xét / kết luận", kind: "textarea" }],
    },
  ],
};

export const FORMS: FormDef[] = [mau1, mau2, mau3, mau4, mau5, mau6, mau7, mau8, mau9];

// Danh sách gọn để hiển thị bộ chọn nhanh mẫu (tránh đưa toàn bộ định nghĩa vào client)
export interface FormOption {
  id: string;
  code: string;
  name: string;
  ageRange: string;
}
export const FORM_OPTIONS: FormOption[] = FORMS.map((f) => ({
  id: f.id,
  code: f.code,
  name: f.name,
  ageRange: f.ageRange,
}));

export function getForm(id: string): FormDef | undefined {
  return FORMS.find((f) => f.id === id);
}

// Tính điểm M-CHAT từ giá trị nhập (chỉ áp dụng cho mau9)
export function scoreMchat(values: Record<string, unknown>): number {
  let score = 0;
  for (let num = 1; num <= 20; num++) {
    const ans = values[`mchat_${num}`];
    if (ans == null || ans === "") continue;
    const riskYes = MCHAT_RISK_YES.has(num);
    if (riskYes) {
      if (ans === "Có") score += 1;
    } else {
      if (ans === "Không") score += 1;
    }
  }
  return score;
}
