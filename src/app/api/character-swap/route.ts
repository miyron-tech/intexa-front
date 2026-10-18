import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ACCESS_COOKIE, apiUrl } from '@/lib/auth-cookies';
import { getCurrentUser } from '@/lib/session';
export const maxDuration = 120;
export async function POST(request:Request) {
  const origin=request.headers.get('origin'),host=request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if(!origin || new URL(origin).host!==host)return Response.json({message:'Invalid request origin'},{status:403});
  if(!await getCurrentUser())return Response.json({message:'Please sign in again.'},{status:401});
  const max=56*1024*1024;
  if(Number(request.headers.get('content-length'))>max)return Response.json({message:'Files are too large.'},{status:413});
  if(!request.body)return Response.json({message:'Upload a video and photo.'},{status:400});
  const reader=request.body.getReader(),chunks:Uint8Array[]=[];let bytes=0;
  try {
    for(;;){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>max){await reader.cancel();return Response.json({message:'Files are too large.'},{status:413});}chunks.push(value);}
    const response=await fetch(apiUrl('/generation/character-swap'),{method:'POST',headers:{'content-type':request.headers.get('content-type') ?? '',authorization:`Bearer ${(await cookies()).get(ACCESS_COOKIE)?.value ?? ''}`},body:Buffer.concat(chunks),signal:AbortSignal.timeout(120000),cache:'no-store'});
    if(response.ok)revalidatePath('/dashboard','layout');
    return new Response(await response.text(),{status:response.status,headers:{'content-type':'application/json'}});
  } catch {return Response.json({message:'Could not upload your files. Please try again.'},{status:503});}
}
