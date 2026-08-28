import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId') || undefined;

  const services = db.getServices(categoryId);
  const categories = db.getCategories();

  return NextResponse.json({
    success: true,
    data: {
      services,
      categories,
    },
  });
}
