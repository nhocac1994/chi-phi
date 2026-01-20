# Hướng Dẫn Lấy Sheet ID và Đặt Tên Sheet

## Vấn Đề Hiện Tại

Bạn đang gặp lỗi 404 vì đã nhập **toàn bộ URL** vào `GOOGLE_SHEETS_ID` thay vì chỉ nhập **Sheet ID**.

## Cách Lấy Sheet ID Đúng

### Từ URL Google Sheet:

Nếu URL của bạn là:
```
https://docs.google.com/spreadsheets/d/1L1_7Nqov5c2ogZZuGDB6HDpk45M9JZw82ToaYqg_4zQ/edit?usp=sharing
```

Thì **Sheet ID** là phần giữa `/d/` và `/edit`:
```
1L1_7Nqov5c2ogZZuGDB6HDpk45M9JZw82ToaYqg_4zQ
```

### Trong file .env.local:

```env
GOOGLE_SHEETS_ID=1L1_7Nqov5c2ogZZuGDB6HDpk45M9JZw82ToaYqg_4zQ
```

**KHÔNG** nhập toàn bộ URL như này:
```env
# ❌ SAI - Đừng làm như này
GOOGLE_SHEETS_ID=https://docs.google.com/spreadsheets/d/1L1_7Nqov5c2ogZZuGDB6HDpk45M9JZw82ToaYqg_4zQ/edit?usp=sharing
```

## Về Tên Sheet

### Tên Sheet Mặc Định: "Sheet1"

Trong code hiện tại, ứng dụng đang sử dụng sheet có tên **"Sheet1"** (tên mặc định của Google Sheets).

### Có 2 Cách:

#### Cách 1: Giữ nguyên tên "Sheet1" (Khuyến nghị)
- Không cần làm gì cả
- Google Sheet mới tạo sẽ tự động có tên "Sheet1"
- Code đã được cấu hình sẵn cho "Sheet1"

#### Cách 2: Đổi tên Sheet trong Google Sheets
1. Mở Google Sheet của bạn
2. Click chuột phải vào tab "Sheet1" ở dưới cùng
3. Chọn "Rename" (Đổi tên)
4. Đặt tên mới (ví dụ: "ChiPhi", "Data", v.v.)
5. **Lưu ý**: Nếu đổi tên, bạn cần cập nhật code trong file `lib/googleSheets.ts`:
   - Thay tất cả `'Sheet1'` thành tên mới của bạn

### Ví dụ nếu đổi tên thành "ChiPhi":

Trong file `lib/googleSheets.ts`, thay:
- `'Sheet1!A2:E'` → `'ChiPhi!A2:E'`
- `'Sheet1!A2'` → `'ChiPhi!A2'`
- `'Sheet1!A1:E1'` → `'ChiPhi!A1:E1'`

## Kiểm Tra Lại

Sau khi sửa file `.env.local` với Sheet ID đúng:

1. **Sheet ID phải là**: Chỉ có các ký tự chữ, số, dấu gạch dưới và gạch ngang
   - ✅ Đúng: `1L1_7Nqov5c2ogZZuGDB6HDpk45M9JZw82ToaYqg_4zQ`
   - ❌ Sai: `https://docs.google.com/spreadsheets/d/...`

2. **Tên Sheet**: Đảm bảo sheet có tên "Sheet1" (hoặc cập nhật code nếu đổi tên)

3. **Chia sẻ Sheet**: Đảm bảo đã chia sẻ Google Sheet với email Service Account

4. **Khởi động lại server**:
   ```bash
   # Dừng server (Ctrl+C)
   # Sau đó chạy lại
   npm run dev
   ```

## Lưu Ý Quan Trọng

- Code đã được cập nhật để **tự động trích xuất Sheet ID** nếu bạn nhập nhầm URL
- Nhưng tốt nhất vẫn nên nhập đúng Sheet ID để tránh lỗi
- Tên sheet phải khớp chính xác (phân biệt chữ hoa/thường)

