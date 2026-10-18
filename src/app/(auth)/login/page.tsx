import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Sign in</h1>
      <LoginForm next={typeof next === "string" ? next : undefined} />
      <p className="mt-6 text-center text-sm text-ink-muted">
        No account yet?{" "}
        <Link href="/register" className="font-medium text-ink hover:underline">
          Create one
        </Link>
      </p>
    </>
  );
}
