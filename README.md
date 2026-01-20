# Quản Lý Chi Phí - Google Sheets

Ứng dụng quản lý chi phí sử dụng Next.js và Google Sheets API.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env.local` với thông tin Google Sheets API:

**Cách 1: Sử dụng template**
```bash
cp env.local.template .env.local
```
Sau đó chỉnh sửa file `.env.local` và điền thông tin thực tế.

**Cách 2: Tạo thủ công**
Tạo file `.env.local` trong thư mục gốc với nội dung:
```
GOOGLE_SHEETS_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
```

**Lưu ý:** 
- File `.env.local` đã được thêm vào `.gitignore` nên sẽ không bị commit lên git
- Private key phải giữ nguyên dấu ngoặc kép và ký tự `\n` để xuống dòng

3. Chạy ứng dụng:
```bash
npm run dev
```

## Cấu hình Google Sheets

1. Tạo Google Cloud Project và bật Google Sheets API
2. Tạo Service Account và tải file JSON credentials
3. Chia sẻ Google Sheet với email của Service Account
4. Lấy Sheet ID từ URL của Google Sheet

