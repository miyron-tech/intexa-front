import Link from "next/link";
import {
  adminApi,
  dollars,
  usd,
  type AdminSummary,
  type AdminUser,
  type PageData,
} from "@/lib/admin";
import { AdminSearch, AdminPagination } from "@/components/admin-table-tools";
export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q.slice(0, 320) : "";
  const page = Math.max(1, Math.min(100000, Number(query.page) || 1));
  const [summary, data] = await Promise.all([
    adminApi<AdminSummary>("summary"),
    adminApi<PageData<AdminUser>>(
      `users?q=${encodeURIComponent(q)}&page=${Math.floor(page)}`,
    ),
  ]);
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Registered users", value: summary.users },
          { label: "Recorded top-ups", value: summary.topUps },
          { label: "Payments recorded", value: dollars(summary.amountCents) },
          {
            label: "Credits on accounts",
            value: summary.creditBalance.toLocaleString("en-US"),
          },
        ].map((item, i) => (
          <div
            key={item.label}
            className={`rounded-2xl border border-line p-5 md:p-6 ${i === 2 ? "bg-[#eaff82]" : "bg-surface"}`}
          >
            <span className="text-xs text-ink-muted">{item.label}</span>
            <p className="text-3xl md:text-4xl tracking-tight mt-4">
              {item.value}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <h2 className="text-2xl tracking-tight">
          Your community <span className="text-ink-muted">/ {data.total}</span>
        </h2>
        <AdminSearch q={q} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface-2 text-[10px] uppercase tracking-wider text-ink-muted">
            <tr>
              {[
                "Account",
                "Role",
                "Credits",
                "Generations",
                "Credits used",
                "Revenue / cost",
                "Gross profit",
                "Joined (UTC)",
                "",
              ].map((h, i) => (
                <th key={i} className="px-5 py-4 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((user) => (
              <tr key={user.id} className="border-t border-line hover:bg-paper">
                <td className="px-5 py-5">
                  <span className="inline-grid place-items-center w-8 h-8 rounded-full bg-accent-soft mr-3 text-accent">
                    {user.email[0].toUpperCase()}
                  </span>
                  <Link href={`/admin/users/${user.id}`} className="text-accent hover:underline">{user.email}</Link>
                </td>
                <td className="px-5 py-5">
                  <span className="rounded-full bg-surface-2 px-3 py-1 text-xs">
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-5 font-medium">
                  {user.creditBalance.toLocaleString("en-US")}
                </td>
                <td className="px-5 py-5">{user.generations}</td>
                <td className="px-5 py-5">{user.creditsUsed.toLocaleString("en-US")}</td>
                <td className="px-5 py-5">{usd(user.revenueUsd)} / {usd(user.costUsd)}</td>
                <td className="px-5 py-5">{user.incompleteCosts ? "Pending cost data" : usd(user.revenueUsd-user.costUsd)}</td>
                <td className="px-5 py-5 text-ink-muted">
                  {new Date(user.createdAt).toISOString().slice(0, 10)}
                </td>
                <td className="px-5 py-5">
                  <Link
                    href={`/admin/top-ups?email=${encodeURIComponent(user.email)}`}
                    className="text-accent text-xs"
                  >
                    Add top-up ↗
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data.rows.length && (
          <div className="py-20 text-center">
            <h3 className="text-xl">No users found.</h3>
            <p className="text-sm text-ink-muted mt-2">
              Try another email address.
            </p>
          </div>
        )}
      </div>
      <AdminPagination page={data.page} total={data.total} q={q} />
    </>
  );
}
