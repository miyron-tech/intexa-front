import { randomUUID } from "node:crypto";
import { adminApi, dollars, type TopUp, type PageData } from "@/lib/admin";
import { TopUpForm } from "@/components/admin-forms";
import { AdminSearch, AdminPagination } from "@/components/admin-table-tools";
export default async function TopUpsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; email?: string }>;
}) {
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q.slice(0, 320) : "";
  const page = Math.floor(
    Math.max(1, Math.min(100000, Number(query.page) || 1)),
  );
  const data = await adminApi<PageData<TopUp>>(
    `top-ups?q=${encodeURIComponent(q)}&page=${page}`,
  );
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_350px] gap-6 items-start">
      <section className="min-w-0">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
          <h2 className="text-2xl tracking-tight">Top-up history</h2>
          <AdminSearch q={q} />
        </div>
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-[10px] uppercase tracking-wider text-ink-muted">
              <tr>
                {[
                  "Account / recorded by",
                  "Amount",
                  "Credits",
                  "Reference",
                  "Date (UTC)",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-4 font-medium whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((t) => (
                <tr key={t.id} className="border-t border-line">
                  <td className="px-4 py-5">
                    <p>{t.email}</p>
                    <span className="text-[10px] text-ink-muted">
                      By {t.actorEmail}
                    </span>
                  </td>
                  <td className="px-4 py-5 whitespace-nowrap">
                    {dollars(t.amountCents)}
                  </td>
                  <td className="px-4 py-5 text-accent">
                    +{t.credits.toLocaleString("en-US")}
                  </td>
                  <td className="px-4 py-5 text-xs min-w-40 max-w-64 break-words">
                    {t.note}
                  </td>
                  <td className="px-4 py-5 text-xs whitespace-nowrap text-ink-muted">
                    {new Date(t.createdAt)
                      .toISOString()
                      .replace("T", " ")
                      .slice(0, 16)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data.rows.length && (
            <div className="py-20 px-6 text-center">
              <span className="text-4xl text-accent">✳</span>
              <h3 className="text-xl mt-4">A clear record, from the start.</h3>
              <p className="text-sm text-ink-muted mt-2">
                {q
                  ? "No top-ups match this email."
                  : "Recorded payments and credit additions will appear here."}
              </p>
            </div>
          )}
        </div>
        <AdminPagination page={page} total={data.total} q={q} />
      </section>
      <TopUpForm
        requestId={randomUUID()}
        email={typeof query.email === "string" ? query.email : ""}
      />
    </div>
  );
}
