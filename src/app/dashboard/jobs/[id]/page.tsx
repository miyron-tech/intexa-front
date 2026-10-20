import { notFound, redirect } from 'next/navigation';
import { getJob } from '@/lib/generation';
import { ApiError } from '@/lib/api';
import { requireUser } from '@/lib/session';
import { sectionFor } from '@/lib/studio-modes';
export const metadata={title:'Your creation'};
export default async function JobPage({params}:PageProps<'/dashboard/jobs/[id]'>){
  await requireUser();
  let job;
  try{job=await getJob((await params).id)}catch(error){if(error instanceof ApiError&&error.status===404)notFound();throw error}
  redirect(`/dashboard/${sectionFor(job.service)}?job=${job.id}`);
}
