import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { Wordmark } from "@/components/logo";
import { getCurrentUser } from "@/lib/session";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="app-header sticky top-0 z-10 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href={user ? "/dashboard" : "/"}
          className="transition hover:opacity-80"
        >
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 hover:bg-surface-2"
              >
                Studio
              </Link>
              {user.role === "admin" && <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-surface-2">Admin</Link>}
              <span className="hidden px-2 text-ink-muted sm:inline">
                {user.email}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg px-3 py-2 hover:bg-surface-2"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 hover:bg-surface-2"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="btn btn-primary h-10 px-4 text-sm"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
