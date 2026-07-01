import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const logEntry = await req.json();
    
    // Log to monitoring service
    if (logEntry.level === 'ERROR' || logEntry.level === 'WARN') {
      logger.warn(`Client log: ${logEntry.level} - ${logEntry.message}`, logEntry.data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process log entry', error);
    return NextResponse.json({ error: 'Failed to process log' }, { status: 500 });
  }
}
