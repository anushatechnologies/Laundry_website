import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { pincode } = await request.json();
    const zone = db.checkPincode(pincode);

    if (zone && zone.isServiceable) {
      return NextResponse.json({
        success: true,
        data: {
          isServiceable: true,
          zone,
          message: `Delivery available in ${zone.areaName}, ${zone.city}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        isServiceable: false,
        message: 'Currently out of service coverage zone.',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to verify pincode' }, { status: 400 });
  }
}
