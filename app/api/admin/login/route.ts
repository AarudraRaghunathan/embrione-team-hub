import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession, credentialsAreValid } from '@/lib/adminAuth';
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (typeof email !== 'string' || typeof password !== 'string' || !credentialsAreValid(email.trim().toLowerCase(), password)) return NextResponse.json({error:'Incorrect email or password.'},{status:401});
    await createAdminSession();
    return NextResponse.json({ok:true});
  } catch (error) { console.error('Admin login failed:', error); return NextResponse.json({error:'Admin login is not configured. Check environment variables.'},{status:500}); }
}
