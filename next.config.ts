import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone-сборка для Docker: тащит только нужные зависимости
  output: "standalone",
  // Явный корень: иначе Next находит посторонний package-lock.json выше по дереву
  turbopack: { root: import.meta.dirname },
  experimental: {
    // Фото товара уходят в Server Action как data URL — лимит по умолчанию 1 МБ мал
    serverActions: { bodySizeLimit: "30mb" },
  },
};

export default nextConfig;
