import Link from "next/link";
export function AdminSearch({
  q,
  placeholder = "Search by email",
}: {
  q: string;
  placeholder?: string;
}) {
  return (
    <form className="flex gap-2">
      <input
        className="field max-w-xs"
        type="search"
        name="q"
        defaultValue={q}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <button className="btn btn-ghost text-xs">Search</button>
      {q && (
        <Link href="?" className="btn btn-ghost text-xs">
          Clear
        </Link>
      )}
    </form>
  );
}
export function AdminPagination({
  page,
  total,
  q,
}: {
  page: number;
  total: number;
  q: string;
}) {
  const pages = Math.max(1, Math.ceil(total / 20));
  return (
    <div className="flex items-center justify-between gap-4 text-xs text-ink-muted py-5">
      <span>
        {total} records · Page {page} of {pages}
      </span>
      <div className="flex gap-4">
        {page > 1 && (
          <Link href={`?q=${encodeURIComponent(q)}&page=${page - 1}`}>
            ← Previous
          </Link>
        )}
        {page < pages && (
          <Link href={`?q=${encodeURIComponent(q)}&page=${page + 1}`}>
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
