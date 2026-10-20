import type { Metadata } from 'next';
import { StudioPage } from '@/components/studio-page';
export const metadata:Metadata={title:'Creative studio'};
export default async function ServicePage({params,searchParams}:PageProps<'/dashboard/[service]'>){
  return <StudioPage id={(await params).service} query={await searchParams}/>;
}
