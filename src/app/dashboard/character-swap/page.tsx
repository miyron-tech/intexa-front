import { StudioPage } from '@/components/studio-page';
export const metadata={title:'Video studio'};
export default async function CharacterSwapPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  return <StudioPage id="character-swap" query={await searchParams}/>;
}
