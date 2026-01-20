import { NextRequest, NextResponse } from 'next/server';
import { getChiPhi, addChiPhi, initSheet, deleteChiPhi } from '@/lib/googleSheets';

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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    
    if (!id || id <= 0) {
      return NextResponse.json(
        { error: 'ID không hợp lệ' },
        { status: 400 }
      );
    }

    await deleteChiPhi(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lỗi API DELETE:', error);
    return NextResponse.json(
      { error: 'Không thể xóa dữ liệu' },
      { status: 500 }
    );
  }
}

