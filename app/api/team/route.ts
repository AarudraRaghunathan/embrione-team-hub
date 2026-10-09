import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
export async function GET() {
  try { const {data,error}=await getSupabaseAdmin().from('members').select('id,name,domain,position,srn,branch,semester,bio,photo_url,linkedin_url,github_url,created_at').eq('status','approved').order('name',{ascending:true}); if(error) throw error; return NextResponse.json({members:data||[]},{headers:{'Cache-Control':'no-store'}}); }
  catch(error){ console.error('Team directory failed:',error); return NextResponse.json({error:'Could not load the team directory.'},{status:500}); }
}
