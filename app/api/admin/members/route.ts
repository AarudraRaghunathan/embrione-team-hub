import { NextResponse } from 'next/server';
import { isAdminSessionValid } from '@/lib/adminAuth';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
export async function GET() {
  if (!(await isAdminSessionValid())) return NextResponse.json({error:'Unauthorized.'},{status:401});
  try {
    const db = getSupabaseAdmin();
    const [{data:members,error},{count:total,error:totalError},{count:pending,error:pendingError},{count:approved,error:approvedError}] = await Promise.all([
      db.from('members').select('*').order('created_at',{ascending:false}),
      db.from('members').select('*',{count:'exact',head:true}),
      db.from('members').select('*',{count:'exact',head:true}).eq('status','pending'),
      db.from('members').select('*',{count:'exact',head:true}).eq('status','approved')
    ]);
    if (error || totalError || pendingError || approvedError) throw error || totalError || pendingError || approvedError;
    return NextResponse.json({members:members || [],counts:{total:total||0,pending:pending||0,approved:approved||0}});
  } catch (error) { console.error('Could not load admin members:',error); return NextResponse.json({error:'Could not load submissions.'},{status:500}); }
}
