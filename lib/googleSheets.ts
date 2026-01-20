import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Hàm trích xuất Sheet ID từ URL hoặc trả về giá trị nếu đã là ID
function getSheetId(input: string | undefined): string {
  if (!input) {
    throw new Error('GOOGLE_SHEETS_ID chưa được cấu hình');
  }
  
  // Nếu là URL, trích xuất Sheet ID
  const urlMatch = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) {
    return urlMatch[1];
  }
  
  // Nếu đã là Sheet ID, trả về trực tiếp
  return input;
}

export interface ChiPhi {
  id?: number;
  khoanChi: string;
  diaDiem: string;
  soTien: number;
  ngayThang: string;
}

export async function getChiPhi(): Promise<ChiPhi[]> {
  try {
    const sheetId = getSheetId(process.env.GOOGLE_SHEETS_ID);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A2:E', // Bỏ qua header row
    });

    const rows = response.data.values || [];
    return rows.map((row, index) => ({
      id: index + 1,
      khoanChi: row[1] || '',
      diaDiem: row[2] || '',
      soTien: parseFloat(row[3] || '0'),
      ngayThang: row[4] || '',
    }));
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu từ Google Sheets:', error);
    throw error;
  }
}

export async function addChiPhi(data: Omit<ChiPhi, 'id'>): Promise<void> {
  try {
    const sheetId = getSheetId(process.env.GOOGLE_SHEETS_ID);
    // Lấy số hàng hiện tại để tính ID
    const existingData = await getChiPhi();
    const newId = existingData.length + 1;

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A2',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          newId.toString(),
          data.khoanChi,
          data.diaDiem,
          data.soTien.toString(),
          data.ngayThang,
        ]],
      },
    });
  } catch (error) {
    console.error('Lỗi khi ghi dữ liệu vào Google Sheets:', error);
    throw error;
  }
}

export async function deleteChiPhi(id: number): Promise<void> {
  try {
    const sheetId = getSheetId(process.env.GOOGLE_SHEETS_ID);
    // Row index = id + 1 (vì có header row ở row 1, data bắt đầu từ row 2)
    // id bắt đầu từ 1, nên row index = id + 1
    const rowIndex = id + 1;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Sheet1
                dimension: 'ROWS',
                startIndex: rowIndex - 1, // 0-based index
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    });

    // Sau khi xóa, cần cập nhật lại ID cho các hàng còn lại
    const remainingData = await getChiPhi();
    if (remainingData.length > 0) {
      const updateValues = remainingData.map((item, index) => [
        (index + 1).toString(),
        item.khoanChi,
        item.diaDiem,
        item.soTien.toString(),
        item.ngayThang,
      ]);

      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Sheet1!A2:E',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: updateValues,
        },
      });
    }
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu từ Google Sheets:', error);
    throw error;
  }
}

export async function initSheet(): Promise<void> {
  try {
    const sheetId = getSheetId(process.env.GOOGLE_SHEETS_ID);
    // Kiểm tra xem header đã tồn tại chưa
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1:E1',
    });

    if (!response.data.values || response.data.values.length === 0) {
      // Tạo header nếu chưa có
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'Sheet1!A1:E1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [['#', 'Khoản Chi', 'Địa điểm', 'Số Tiền', 'Ngày tháng']],
        },
      });
    }
  } catch (error) {
    console.error('Lỗi khi khởi tạo sheet:', error);
    throw error;
  }
}

