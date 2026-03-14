import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'bookings.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

function readBookings() {
  ensureDataFile();
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeBookings(bookings: any[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, wechat, interviewTime, notes } = body;

    // 验证必填字段
    if (!name || !wechat || !interviewTime) {
      return NextResponse.json(
        { error: '请填写必填字段' },
        { status: 400 }
      );
    }

    const bookings = readBookings();
    const newBooking = {
      id: Date.now().toString(),
      name,
      wechat,
      interviewTime,
      notes: notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    writeBookings(bookings);

    return NextResponse.json({
      success: true,
      message: '预约成功',
      bookingId: newBooking.id,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 简单的认证检查（实际使用应该用更安全的认证）
    const authHeader = request.headers.get('authorization');
    if (authHeader !== 'Bearer admin-secret-key-2024') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const bookings = readBookings();
    // 按创建时间倒序排列
    bookings.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 更新预约状态
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== 'Bearer admin-secret-key-2024') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    const bookings = readBookings();
    const index = bookings.findIndex((b: any) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: '预约不存在' },
        { status: 404 }
      );
    }

    bookings[index].status = status;
    bookings[index].updatedAt = new Date().toISOString();
    writeBookings(bookings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
