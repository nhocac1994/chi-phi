# Quản Lý Chi Phí

Ứng dụng quản lý chi phí sử dụng Next.js và [Stein API](https://docs.steinhq.com/) (Google Sheet làm database).

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env.local`:

```bash
cp env.local.template .env.local
```

Thêm vào `.env.local`:

```
NEXT_PUBLIC_STEIN_API_URL=https://api.steinhq.com/v1/storages/YOUR_STORAGE_ID/sheet1
STEIN_API_URL=https://api.steinhq.com/v1/storages/YOUR_STORAGE_ID/sheet1
```

3. Chạy ứng dụng:
```bash
npm run dev
```

## Deploy

- GitHub: [nhocac1994/chi-phi](https://github.com/nhocac1994/chi-phi)
- Netlify: xem `HUONG_DAN_DEPLOY.md`

