# Hướng Dẫn Deploy Lên GitHub và Netlify

## Bước 1: Khởi tạo Git và đẩy lên GitHub

```bash
# Khởi tạo git repository
git init

# Thêm tất cả các file (trừ những file trong .gitignore)
git add .

# Commit lần đầu
git commit -m "Initial commit: Quản lý chi phí với Google Sheets"

# Thêm remote repository
git remote add origin https://github.com/nhocac1994/chi-phi.git

# Đổi tên branch thành main
git branch -M main

# Đẩy code lên GitHub
git push -u origin main
```

**Lưu ý quan trọng:**
- File `.env.local` đã được thêm vào `.gitignore` nên sẽ **KHÔNG** bị đẩy lên GitHub
- Chỉ các file code và cấu hình công khai mới được đẩy lên

## Bước 2: Tạo file .env.example (tùy chọn)

Tạo file `.env.example` để hướng dẫn người khác cấu hình:

```bash
# Copy từ template
cp env.local.template .env.example
```

## Bước 3: Deploy lên Netlify

### Cách 1: Deploy từ GitHub (Khuyến nghị)

1. **Đăng nhập Netlify:**
   - Truy cập [netlify.com](https://www.netlify.com)
   - Đăng nhập bằng GitHub

2. **Kết nối Repository:**
   - Click "Add new site" > "Import an existing project"
   - Chọn "GitHub" và authorize Netlify
   - Chọn repository `nhocac1994/chi-phi`

3. **Cấu hình Build Settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Base directory:** (để trống)

4. **Thêm Environment Variables:**
   - Vào "Site settings" > "Environment variables"
   - Thêm các biến sau:
     ```
     GOOGLE_SHEETS_ID=your_sheet_id_here
     GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
     GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key\n-----END PRIVATE KEY-----\n"
     ```

5. **Deploy:**
   - Click "Deploy site"
   - Netlify sẽ tự động build và deploy

### Cách 2: Deploy trực tiếp (Netlify CLI)

```bash
# Cài đặt Netlify CLI
npm install -g netlify-cli

# Đăng nhập
netlify login

# Deploy
netlify deploy --prod
```

## Bước 4: Cấu hình sau khi deploy

1. **Kiểm tra Environment Variables:**
   - Đảm bảo tất cả biến môi trường đã được thêm đúng

2. **Test ứng dụng:**
   - Truy cập URL được Netlify cung cấp
   - Kiểm tra xem ứng dụng có hoạt động không

3. **Custom Domain (tùy chọn):**
   - Vào "Domain settings" để thêm domain tùy chỉnh

## Lưu ý quan trọng

- ✅ File `.env.local` sẽ **KHÔNG** bị đẩy lên GitHub (đã có trong .gitignore)
- ✅ Phải thêm Environment Variables trên Netlify
- ✅ Google Sheets API credentials phải được cấu hình trên Netlify
- ✅ Đảm bảo Google Sheet đã được chia sẻ với Service Account email

## Troubleshooting

### Lỗi build trên Netlify:
- Kiểm tra Node.js version trong `package.json`
- Kiểm tra build command đúng chưa
- Xem build logs trên Netlify dashboard

### Lỗi kết nối Google Sheets:
- Kiểm tra Environment Variables đã đúng chưa
- Kiểm tra Service Account có quyền truy cập Sheet không
- Kiểm tra Sheet ID đúng chưa

