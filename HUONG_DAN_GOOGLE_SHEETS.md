# Hướng Dẫn Lấy Thông Tin Google Sheets API

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập bằng tài khoản Google của bạn
3. Click vào dropdown project ở trên cùng (hoặc tạo project mới)
4. Click "New Project"
5. Đặt tên project (ví dụ: "chi-phi-app")
6. Click "Create"

## Bước 2: Bật Google Sheets API

1. Trong Google Cloud Console, vào menu ☰ (góc trên bên trái)
2. Chọn **APIs & Services** > **Library**
3. Tìm kiếm "Google Sheets API"
4. Click vào "Google Sheets API"
5. Click nút **Enable** để bật API

## Bước 3: Tạo Service Account

1. Vào menu ☰ > **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** ở trên cùng
3. Chọn **Service Account**
4. Điền thông tin:
   - **Service account name**: Đặt tên (ví dụ: "chi-phi-service")
   - **Service account ID**: Sẽ tự động tạo
   - Click **CREATE AND CONTINUE**
5. Bỏ qua phần "Grant this service account access to project" (click **CONTINUE**)
6. Bỏ qua phần "Grant users access to this service account" (click **DONE**)

## Bước 4: Tạo Key cho Service Account

1. Trong trang **Credentials**, tìm Service Account vừa tạo
2. Click vào email của Service Account (có dạng: `chi-phi-service@project-id.iam.gserviceaccount.com`)
3. Vào tab **KEYS**
4. Click **ADD KEY** > **Create new key**
5. Chọn format **JSON**
6. Click **CREATE**
7. File JSON sẽ tự động tải xuống (tên file thường là `project-id-xxxxx.json`)

## Bước 5: Lấy Thông Tin Từ File JSON

Mở file JSON vừa tải xuống, bạn sẽ thấy cấu trúc như sau:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "chi-phi-service@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  ...
}
```

### Lấy GOOGLE_SERVICE_ACCOUNT_EMAIL:
- Copy giá trị của trường `"client_email"` 
- Ví dụ: `chi-phi-service@your-project-id.iam.gserviceaccount.com`

### Lấy GOOGLE_PRIVATE_KEY:
- Copy toàn bộ giá trị của trường `"private_key"` (bao gồm cả `-----BEGIN PRIVATE KEY-----` và `-----END PRIVATE KEY-----`)
- **QUAN TRỌNG**: Giữ nguyên các ký tự `\n` trong chuỗi
- Ví dụ: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"`

## Bước 6: Lấy GOOGLE_SHEETS_ID

1. Tạo một Google Sheet mới tại [Google Sheets](https://sheets.google.com)
2. Mở Google Sheet vừa tạo
3. Nhìn vào URL trên trình duyệt:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit#gid=0
   ```
4. Copy phần `SHEET_ID_HERE` (đó chính là Sheet ID)
   - Ví dụ: Nếu URL là `https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit`
   - Thì Sheet ID là: `1a2b3c4d5e6f7g8h9i0j`

## Bước 7: Chia Sẻ Google Sheet với Service Account

1. Mở Google Sheet của bạn
2. Click nút **Share** (góc trên bên phải)
3. Trong ô "Add people and groups", paste email của Service Account (từ `client_email`)
4. Chọn quyền **Editor**
5. **Bỏ tick** "Notify people" (không cần gửi email)
6. Click **Share**

## Bước 8: Điền Thông Tin Vào .env.local

Mở file `.env.local` và điền thông tin:

```env
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_SERVICE_ACCOUNT_EMAIL=chi-phi-service@your-project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Lưu ý quan trọng:**
- `GOOGLE_PRIVATE_KEY` phải được đặt trong dấu ngoặc kép `"`
- Giữ nguyên các ký tự `\n` (không thay bằng xuống dòng thật)
- Không có khoảng trắng thừa

## Kiểm Tra

Sau khi điền xong, chạy:
```bash
npm run dev
```

Nếu mọi thứ đúng, ứng dụng sẽ chạy và bạn có thể thêm/xem dữ liệu từ Google Sheets!

