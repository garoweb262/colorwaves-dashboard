import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const authToken = request.cookies.get('authToken');

    if (authToken?.value === 'authenticated') {
        return NextResponse.json({ authenticated: true });
    } else {
        return NextResponse.json(
            { authenticated: false },
            { status: 401 }
        );
    }
} 