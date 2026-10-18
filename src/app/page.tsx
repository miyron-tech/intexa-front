import Link from "next/link";
import { api } from "@/lib/api";
import type { Plan } from "@/lib/admin";
import { getCurrentUser } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { StudioLanding } from "@/components/studio-landing";
import { MobileNavigation } from "@/components/mobile-navigation";
import { SiteLegalFooter } from "@/components/site-legal-footer";
import "./studio.css";

export default async function HomePage() {
  const user = await getCurrentUser();
  const plans = await api<Plan[]>("/plans", { auth: false }).catch(() => []);
  const startHref = user ? "/dashboard" : "/register";

  return (
    <div className="restored-home">
      <header className="landing-header">
        <Link
          className="studio-wordmark brand-wordmark"
          href="/"
          aria-label="intexa-ai.com home"
        >
          intexa-ai<span className="brand-domain">.com</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/#possibilities">Explore</Link>
          <Link href="/#use-cases">For creators</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#pricing">Pricing</Link>
        </nav>
        <div className="header-actions">
          {user ? (
            <form action={logout}>
              <button type="submit" className="header-login">
                Sign out
              </button>
            </form>
          ) : (
            <Link className="header-login" href="/login">
              Sign in
            </Link>
          )}
          <Link className="header-start" href={startHref}>
            {user ? "Open workspace" : "Start creating"}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <MobileNavigation signedIn={Boolean(user)}>
          {user && (
            <form action={logout}>
              <button type="submit">Sign out</button>
            </form>
          )}
        </MobileNavigation>
      </header>
      <StudioLanding startHref={startHref} plans={plans.map(({ id, credits, monthlyCents }) => ({ id, credits, monthlyCents }))} />
      <SiteLegalFooter />
    </div>
  );
}
