import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'embrione_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 8;
function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters.');
  return value;
}
function sign(value: string) { return createHmac('sha256', secret()).update(value).digest('base64url'); }
export function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a); const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
export function credentialsAreValid(email: string, password: string) {
  return safeEqual(email, process.env.ADMIN_EMAIL || '') && safeEqual(password, process.env.ADMIN_PASSWORD || '');
}
export async function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: expires })).toString('base64url');
  const token = `${payload}.${sign(payload)}`;
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: MAX_AGE_SECONDS });
}
export async function isAdminSessionValid() {
  try {
    const jar = await cookies(); const token = jar.get(COOKIE_NAME)?.value;
    if (!token) return false;
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return false;
    if (!safeEqual(signature, sign(payload))) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { role?: string; exp?: number };
    return data.role === 'admin' && typeof data.exp === 'number' && data.exp > Math.floor(Date.now() / 1000);
  } catch { return false; }
}
export async function clearAdminSession() {
  const jar = await cookies(); jar.set(COOKIE_NAME, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
}
