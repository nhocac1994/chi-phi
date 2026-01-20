import { NextRequest, NextResponse } from 'next/server';
import { getChiPhi, addChiPhi, initSheet } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await getChiPhi();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Lỗi API GET:', error);
    return NextResponse.json(
      { error: 'Không thể lấy dữ liệu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await addChiPhi(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lỗi API POST:', error);
    return NextResponse.json(
      { error: 'Không thể thêm dữ liệu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Khởi tạo sheet nếu chưa có header
    await initSheet();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lỗi API PUT:', error);
    return NextResponse.json(
      { error: 'Không thể khởi tạo sheet' },
      { status: 500 }
    );
  }
}

