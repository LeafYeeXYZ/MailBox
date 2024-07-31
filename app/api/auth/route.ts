import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ message: 'Hello, world!' })
}