import { NextRequest, NextResponse } from 'next/server';

interface AuthResult {
  ok: boolean;
  telegramId?: string;
  response?: NextResponse;
}

export async function authenticateRequest(req: Request): Promise<AuthResult> {
  try {
    const url = new URL(req.url);
    const initData = url.searchParams.get('initData') || 
                     (await (req as any).json?.().then((b: any) => b.initData).catch(() => null));

    if (!initData) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Missing initData' }, { status: 401 })
      };
    }

    // Parse telegram user from init data
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    
    if (!userStr) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Invalid telegram data' }, { status: 401 })
      };
    }

    const user = JSON.parse(userStr);
    return {
      ok: true,
      telegramId: String(user.id)
    };
  } catch (error) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    };
  }
}
