"use server";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/admin";
import { api, ApiError } from "@/lib/api";
export interface AdminState {
  error?: string;
  success?: string;
  nextRequestId?: string;
}
function cents(value: FormDataEntryValue | null) {
  const s = String(value ?? "");
  if (!/^\d{1,6}(\.\d{1,2})?$/.test(s))
    throw new Error("Enter a valid USD amount with up to two decimal places.");
  const [whole, fraction = ""] = s.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}
function integer(value: FormDataEntryValue | null) {
  const s = String(value ?? "");
  if (!/^\d{1,8}$/.test(s)) throw new Error("Credits must be a whole number.");
  return Number(s);
}
function message(error: unknown) {
  return error instanceof ApiError
    ? error.messages.join(". ")
    : error instanceof Error
      ? error.message
      : "Could not save. Please try again.";
}
export async function savePlan(
  _state: AdminState,
  form: FormData,
): Promise<AdminState> {
  await requireAdmin();
  try {
    await api(`/admin/plans/${encodeURIComponent(String(form.get("id")))}`, {
      method: "PATCH",
      body: JSON.stringify({
        monthlyCents: cents(form.get("monthly")),
        annualMonthlyCents: cents(form.get("annual")),
        credits: integer(form.get("credits")),
        version: integer(form.get("version")),
      }),
    });
  } catch (e) {
    return { error: message(e) };
  }
  revalidatePath("/admin/plans");
  revalidatePath("/");
  return { success: "Plan saved. Public pricing is updated." };
}
export async function recordTopUp(
  _state: AdminState,
  form: FormData,
): Promise<AdminState> {
  await requireAdmin();
  try {
    await api("/admin/top-ups", {
      method: "POST",
      body: JSON.stringify({
        requestId: String(form.get("requestId")),
        email: String(form.get("email") ?? "")
          .trim()
          .toLowerCase(),
        amountCents: cents(form.get("amount")),
        credits: integer(form.get("credits")),
        note: String(form.get("note") ?? "").trim(),
      }),
    });
  } catch (e) {
    return { error: message(e) };
  }
  revalidatePath("/admin");
  revalidatePath("/admin/top-ups");
  revalidatePath("/dashboard");
  return {
    success: "Top-up recorded. Credits added to the account.",
    nextRequestId: randomUUID(),
  };
}
