import {
  Camera,
  Image,
  UserRound,
  Film,
  PackageOpen,
  ShoppingBag,
  Sun,
  Clapperboard,
  Replace,
  Captions,
} from "lucide-react";
import type { ServiceDefinition, ServiceId } from "./generation-types";
export type StudioSection = "images" | "video" | "content";
export const sectionFor = (id: string): StudioSection =>
  id === "content_optimization"
    ? "content"
    : ["video_ad", "character_swap"].includes(id)
      ? "video"
      : "images";
export const sectionTitle = {
  images: "Image generation",
  video: "Video generation",
  content: "Content optimization",
};
export const modeStyle: Record<
  string,
  { icon: typeof Camera; color: string; tint: string; title: string }
> = {
  marketplace_card: {
    icon: Image,
    color: "#7b66ab",
    tint: "#eee8f7",
    title: "Listing cards",
  },
  product_shot: {
    icon: Camera,
    color: "#aa6e3e",
    tint: "#f6eadb",
    title: "Product photography",
  },
  avatar: {
    icon: UserRound,
    color: "#558c79",
    tint: "#e2efe7",
    title: "Portraits & avatars",
  },
  custom: {
    icon: Film,
    color: "#7865b3",
    tint: "#ede7fa",
    title: "Video from scratch",
  },
  product_demo: {
    icon: ShoppingBag,
    color: "#b47c36",
    tint: "#f7eddb",
    title: "Product demo",
  },
  unboxing: {
    icon: PackageOpen,
    color: "#ad6958",
    tint: "#f7e6df",
    title: "Unboxing",
  },
  lifestyle: {
    icon: Sun,
    color: "#508f88",
    tint: "#dff0eb",
    title: "Lifestyle scene",
  },
  atmosphere: {
    icon: Clapperboard,
    color: "#637eaa",
    tint: "#e6edf8",
    title: "Atmospheric b-roll",
  },
  character_swap: {
    icon: Replace,
    color: "#a26796",
    tint: "#f3e5f0",
    title: "Replace character",
  },
  tiktok: {
    icon: Captions,
    color: "#477b82",
    tint: "#e0eef0",
    title: "TikTok description",
  },
};
export function studioModes(
  services: ServiceDefinition[],
  section: StudioSection,
) {
  if (section === "video")
    return [
      ...(services.find((s) => s.id === "video_ad")?.presets ?? []).map(
        (p) => ({
          id: `video_ad:${p.id}`,
          service: "video_ad" as ServiceId,
          preset: p.id,
          ...(modeStyle[p.id] ?? modeStyle.custom),
          title: p.id === "custom" ? "Video from scratch" : p.title,
        }),
      ),
      {
        id: "character_swap",
        service: "character_swap" as ServiceId,
        preset: "wan-std",
        ...modeStyle.character_swap,
      },
    ];
  return services
    .filter((s) => sectionFor(s.id) === section)
    .map((s) => ({
      id: s.id,
      service: s.id,
      preset: s.presets[0]?.id ?? "",
      ...(modeStyle[s.id] ?? modeStyle.tiktok),
    }));
}
