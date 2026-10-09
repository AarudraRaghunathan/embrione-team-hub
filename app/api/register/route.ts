import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { DOMAINS, POSITIONS, BRANCHES } from '@/lib/types';

export const runtime = 'nodejs';
const text = (form: FormData, key: string) => String(form.get(key) || '').trim();
export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const name = text(form,'name'), domain = text(form,'domain'), position = text(form,'position');
    const srn = text(form,'srn').toUpperCase(), email = text(form,'email').toLowerCase();
    const branch = text(form,'branch'), semester = Number(text(form,'semester')), bio = text(form,'bio');
    const linkedin_url = text(form,'linkedin_url'), github_url = text(form,'github_url');
    const photo = form.get('photo');
    if (!name || !srn || !email || !branch || !Number.isInteger(semester)) return NextResponse.json({error:'Please complete all required fields.'},{status:400});
    if (!(DOMAINS as readonly string[]).includes(domain) || !(POSITIONS as readonly string[]).includes(position) || !(BRANCHES as readonly string[]).includes(branch) || semester < 1 || semester > 8) return NextResponse.json({error:'Please choose valid domain, position, branch, and semester values.'},{status:400});
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({error:'Enter a valid email address.'},{status:400});
    if (bio.length > 200) return NextResponse.json({error:'Keep your bio within 200 characters.'},{status:400});
    if (!(photo instanceof File) || photo.size === 0) return NextResponse.json({error:'Please choose a profile picture.'},{status:400});
    if (photo.type !== 'image/webp') return NextResponse.json({error:'The profile picture must be converted to WebP before upload.'},{status:400});
    if (photo.size > 3 * 1024 * 1024) return NextResponse.json({error:'Converted image must be under 3 MB.'},{status:400});
    const supabase = getSupabaseAdmin();
    const { data: duplicate, error: duplicateError } = await supabase.from('members').select('id').ilike('srn', srn).maybeSingle();
    if (duplicateError) throw duplicateError;
    if (duplicate) return NextResponse.json({error:'This SRN has already been submitted.'},{status:409});
    const safeName = `${crypto.randomUUID()}.webp`;
    const { error: uploadError } = await supabase.storage.from('member-photos').upload(safeName, photo, { contentType:'image/webp', upsert:false, cacheControl:'3600' });
    if (uploadError) throw uploadError;
    const { data: publicData } = supabase.storage.from('member-photos').getPublicUrl(safeName);
    const { data, error } = await supabase.from('members').insert({ name, domain, position, srn, email, linkedin_url: linkedin_url || null, github_url: github_url || null, branch, semester, bio: bio || null, photo_url: publicData.publicUrl, status:'pending' }).select('id').single();
    if (error) { await supabase.storage.from('member-photos').remove([safeName]); if (error.code === '23505') return NextResponse.json({error:'This SRN has already been submitted.'},{status:409}); throw error; }
    return NextResponse.json({ok:true,id:data.id,message:'Profile submitted for admin review.'},{status:201});
  } catch (error) { console.error('Registration failed:', error); return NextResponse.json({error:'Could not submit your profile. Check the Supabase setup and try again.'},{status:500}); }
}
