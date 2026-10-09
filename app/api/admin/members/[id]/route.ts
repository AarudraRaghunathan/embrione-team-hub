import { NextRequest, NextResponse } from 'next/server';
import { isAdminSessionValid } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { isValidUUID } from '@/lib/validation';
export async function PATCH(request: NextRequest, context: {params: Promise<{id:string}>}) {
  if (!(await isAdminSessionValid())) return NextResponse.json({error:'Unauthorized.'},{status:401});
  const {id}=await context.params; if(!isValidUUID(id)) return NextResponse.json({error:'Invalid member ID.'},{status:400});
  try { const {status}=await request.json(); if(!['pending','approved','rejected'].includes(status)) return NextResponse.json({error:'Invalid status.'},{status:400});
    const {error}=await getSupabaseAdmin().from('members').update({status}).eq('id',id); if(error) throw error;
    return NextResponse.json({ok:true});
  } catch(error) { console.error('Status update failed:',error); return NextResponse.json({error:'Could not update this member.'},{status:500}); }
}
export async function DELETE(_request: NextRequest, context: {params: Promise<{id:string}>}) {
  if (!(await isAdminSessionValid())) return NextResponse.json({error:'Unauthorized.'},{status:401});
  const {id}=await context.params; if(!isValidUUID(id)) return NextResponse.json({error:'Invalid member ID.'},{status:400});
  try { const db=getSupabaseAdmin(); const {data:member,error:readError}=await db.from('members').select('photo_url').eq('id',id).single(); if(readError) throw readError;
    const {error}=await db.from('members').delete().eq('id',id); if(error) throw error;
    if(member?.photo_url){ const marker='/member-photos/'; const index=member.photo_url.indexOf(marker); if(index>=0) await db.storage.from('member-photos').remove([decodeURIComponent(member.photo_url.slice(index+marker.length).split('?')[0])]); }
    return NextResponse.json({ok:true});
  } catch(error) { console.error('Delete failed:',error); return NextResponse.json({error:'Could not delete this member.'},{status:500}); }
}
