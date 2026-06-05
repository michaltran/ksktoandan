# Phần mềm nhập liệu Khám sức khỏe trẻ em

Phần mềm nhập liệu cho **9 mẫu giấy khám sức khỏe trẻ em** (theo độ tuổi), tối ưu cho việc nhập nhanh và **xuất Excel**. Xây dựng bằng **Next.js + Neon (Postgres)**, triển khai trên **Vercel**.

## Các mẫu phiếu

| Mẫu | Độ tuổi |
|-----|---------|
| Mẫu 1 | 0 - dưới 2 tháng |
| Mẫu 2 | 2 - 3 tháng |
| Mẫu 3 | 4 - 6 tháng |
| Mẫu 4 | 7 - 9 tháng |
| Mẫu 5 | 10 - 12 tháng |
| Mẫu 6 | 13 - 18 tháng |
| Mẫu 7 | 19 - dưới 24 tháng |
| Mẫu 8 | 2 - dưới 6 tuổi |
| Mẫu 9 | M-CHAT-R (16 - 30 tháng) — tự kỷ, tự động tính điểm |

Mỗi phiếu gồm đầy đủ các mục của bản gốc: Hành chính, Dấu hiệu sinh tồn, Dinh dưỡng, Phát triển tinh thần - vận động (mốc theo tuổi), Tiêm chủng, Tư vấn, Khám lâm sàng, Kết luận.

## Tính năng giúp nhập liệu nhanh

- **Chọn sẵn giá trị "Bình thường"**: các trường khám lâm sàng / sinh tồn mặc định là *Bình thường*, bác sĩ chỉ cần bấm vào mục **bất thường**.
- **Nút "Tất cả bình thường" / "Tất cả Có"** cho từng mục.
- Nút bấm dạng segmented (1 chạm), tô màu xanh = bình thường, đỏ = bất thường.
- **M-CHAT-R tự tính điểm** ngay khi nhập và phân loại nguy cơ.
- Lưu, sửa, xóa hồ sơ; lọc theo mẫu.
- **Xuất Excel**: mỗi mẫu 1 sheet, mỗi trường 1 cột (Mẫu 9 có thêm cột điểm & phân loại).

## Chạy thử trên máy (local)

```bash
npm install
npm run dev
```
Mở http://localhost:3000

> Nếu chưa cấu hình `DATABASE_URL`, app tự lưu tạm vào thư mục `.data/` (chỉ để chạy thử). Khi deploy lên Vercel **bắt buộc** dùng Neon.

## Cấu hình cơ sở dữ liệu Neon

1. Tạo project miễn phí tại https://neon.tech
2. Vào **Connection Details** → copy *Connection string* (chọn **Pooled connection**).
3. Tạo file `.env.local` (copy từ `.env.example`):
   ```
   DATABASE_URL="postgresql://...-pooler....neon.tech/dbname?sslmode=require"
   ```
4. Chạy lại `npm run dev`. Bảng `ksk_records` sẽ **tự động tạo** ở lần ghi đầu tiên.

## Triển khai lên Vercel

1. Đẩy code lên GitHub.
2. Vào https://vercel.com → **Add New → Project** → chọn repo.
3. Trong **Environment Variables**, thêm:
   - `DATABASE_URL` = connection string Neon (pooled).
4. Bấm **Deploy**. Vercel tự build (`next build`).

> Mẹo: Có thể dùng **Vercel ↔ Neon integration** (Marketplace) để Vercel tự tạo Neon DB và tự thêm biến `DATABASE_URL`.

## Cấu trúc dữ liệu

Bảng `ksk_records`:

| Cột | Kiểu | Mô tả |
|-----|------|------|
| id | SERIAL | khóa chính |
| form_id | TEXT | mã mẫu (mau1..mau9) |
| child_name | TEXT | họ tên trẻ (trích từ phiếu) |
| dob | TEXT | ngày sinh |
| mchat_score | INTEGER | điểm M-CHAT (chỉ Mẫu 9) |
| values | JSONB | toàn bộ giá trị các trường |
| created_at / updated_at | TIMESTAMPTZ | thời gian |

Lưu dạng JSONB nên thêm/sửa trường trong định nghĩa phiếu không cần đổi schema DB.

## Tùy chỉnh / mở rộng

Toàn bộ phiếu được định nghĩa bằng dữ liệu trong:
- `src/lib/forms/schema.ts` — kiểu trường
- `src/lib/forms/common.ts` — các mục dùng chung (hành chính, sinh tồn, dinh dưỡng, tiêm chủng, kết luận…)
- `src/lib/forms/exams.ts` — phần khám lâm sàng theo nhóm tuổi
- `src/lib/forms/definitions.ts` — ghép thành 9 mẫu + mốc phát triển/vắc xin theo tuổi

Giao diện nhập liệu tự sinh từ các định nghĩa này (`src/components/FormRenderer.tsx`).
