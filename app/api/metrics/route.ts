import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    if (type === 'slow_metric') {
      logger.warn(`Slow metric detected: ${data.name} - ${data.value}${data.unit}`);
    } else if (type === 'error') {
      logger.error(`Client error: ${data.context}`, data.error);
    }

    // Here you would send to monitoring service like Sentry, DataDog, etc.

    return NextResponse.json({ success: true });
  } catch (error) {
  console.error('Failed to process metric', error);
    return NextResponse.json({ error: 'Failed to process metric' }, { status: 500 });
  }
}
