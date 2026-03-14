import { NextRequest, NextResponse } from 'next/server';

// ⚠️ 注意：生产环境请使用数据库（Vercel KV / Supabase / 飞书多维表格）
// 当前使用内存存储，重启后会丢失数据（仅用于演示）
let bookings: any[] = [];

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

    // 按创建时间倒序排列
    const sortedBookings = [...bookings].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ bookings: sortedBookings });
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

    const index = bookings.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: '预约不存在' },
        { status: 404 }
      );
    }

    bookings[index].status = status;
    bookings[index].updatedAt = new Date().toISOString();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
