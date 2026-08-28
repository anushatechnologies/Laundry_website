import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { code, orderTotal, isFirstOrder } = await request.json();
    const result = db.validateCoupon(code, orderTotal, isFirstOrder ?? false);

    return NextResponse.json({
      success: result.isValid,
      data: result,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process coupon' }, { status: 400 });
  }
}
