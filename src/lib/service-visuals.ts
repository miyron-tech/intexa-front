import type { ServiceId } from './generation-types';
export const serviceVisuals: Record<ServiceId, { image: string; imageMedium: string; imageLarge: string; label: string; number: string; tagline: string }> = {
  content_optimization: { image: '/media/studio/scene-11.webp', imageMedium: '/media/studio/scene-11-medium.webp', imageLarge: '/media/studio/scene-11-large.webp', label: 'Content optimization', number: '03', tagline: 'The right words for your next post.' },
  character_swap: { image: '/media/studio/scene-02.webp', imageMedium: '/media/studio/scene-02-medium.webp', imageLarge: '/media/studio/scene-02-large.webp',label:'Replace character',number:'05',tagline:'A new character. The same performance.' },
  marketplace_card: { image: '/media/studio/scene-08.webp', imageMedium: '/media/studio/scene-08-medium.webp', imageLarge: '/media/studio/scene-08-large.webp', label: 'Listing cards', number: '01', tagline: 'Make the first impression count.' },
  product_shot: { image: '/media/studio/scene-03.webp', imageMedium: '/media/studio/scene-03-medium.webp', imageLarge: '/media/studio/scene-03-large.webp', label: 'Product photography', number: '02', tagline: 'Your product. A new perspective.' },
  video_ad: { image: '/media/studio/scene-11.webp', imageMedium: '/media/studio/scene-11-medium.webp', imageLarge: '/media/studio/scene-11-large.webp', label: 'Video ads', number: '03', tagline: 'Give your next idea a little motion.' },
  avatar: { image: '/media/studio/scene-02.webp', imageMedium: '/media/studio/scene-02-medium.webp', imageLarge: '/media/studio/scene-02-large.webp', label: 'Portraits & avatars', number: '04', tagline: 'A fresh way to show up.' },
};
