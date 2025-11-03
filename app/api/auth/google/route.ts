import { NextResponse } from 'next/server';
import { generateAuthUrl } from '@/lib/drive/googleDrive';

export async function GET() {
  try {
    const authUrl = generateAuthUrl();
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}