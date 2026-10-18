import "server-only";
import { redirect } from "next/navigation";
import { requireUser } from "./session";
import { api } from "./api";
export interface Plan {
  id: string;
  name: string;
  monthlyCents: number;
  annualMonthlyCents: number;
  credits: number;
  version: number;
  updatedAt: string;
}
export interface AdminUser {
  id: string;
  email: string;
  role: "user" | "admin";
  creditBalance: number;
  createdAt: string;
  generations: number;
  creditsUsed: number;
  costUsd: number;
  revenueUsd: number;
  incompleteCosts: number;
}
export interface TopUp {
  id: string;
  email: string;
  actorEmail: string;
  amountCents: number;
  credits: number;
  note: string;
  createdAt: string;
}
export interface PageData<T> {
  rows: T[];
  total: number;
  page: number;
}
export interface AdminSummary {
  users: number;
  topUps: number;
  amountCents: number;
  creditBalance: number;
}
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}
export async function adminApi<T>(path: string) {
  await requireAdmin();
  return api<T>(`/admin/${path}`);
}
export const dollars = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );

export interface EconomicsMetrics {
  generations: number; creditsUsed: number; creditsReserved: number; creditsRefunded: number;
  costUsd: number; revenueUsd: number; profitUsd: number | null; confirmedProfitUsd: number; incompleteCosts: number;
  succeeded: number; failed: number; paymentsUsd: number; unspentValueUsd: number;
}
export interface ModelUsage {
  model: string; kind: string; calls: number; costUsd: number;
  inputTokens: number | null; outputTokens: number | null; unknownCosts: number;
}
export interface AdminGeneration {
  id: string; service: string; preset: string; status: string; params: Record<string, unknown>;
  prompt: string | null; model: string | null; error: string | null; remoteId: string | null;
  createdAt: string; finishedAt: string | null; pricingVersion: string | null;
  creditsReserved: number; creditsCharged: number; billingStatus: string;
  costUsd: number; revenueUsd: number; profitUsd: number | null; costComplete: boolean;
  outputs: { index: number; mimeType: string; width?: number; height?: number; bytes: number }[];
  usage: { id: string; kind: string; model: string; prompt: string; costUsd: number | null;
    inputTokens: number | null; outputTokens: number | null; state: string; providerId: string | null }[];
}
export interface UserEconomics {
  user: AdminUser & EconomicsMetrics;
  jobs: PageData<AdminGeneration>;
}
export const usd = (value: number) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 5,
}).format(value);
