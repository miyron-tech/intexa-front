import Link from "next/link";
import type { ReactNode } from "react";
import { company, legalLinks } from "@/lib/company";

// Shared frame for /legal/* pages. Body is plain h2/h3/p/ul/table markup styled by legal.css.
export function LegalDocument({ title, updated, intro, children }: { title: string; updated: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <div className="legal-page">
      <nav className="legal-nav" aria-label="Legal documents">
        {legalLinks.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>
      <article className="legal-doc">
        <p className="legal-kicker">Legal · {company.name}</p>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: <time dateTime={updated}>{updated}</time></p>
        {intro && <div className="legal-intro">{intro}</div>}
        {children}
      </article>
    </div>
  );
}

export function CompanyDetails() {
  return (
    <dl className="legal-details">
      <dt>Company</dt><dd>{company.name}</dd>
      <dt>Legal form</dt><dd>{company.legalForm}</dd>
      <dt>Company code</dt><dd>{company.code}</dd>
      <dt>Registered</dt><dd>{company.registry}, {company.registeredOn}</dd>
      <dt>Registered office</dt><dd>{company.address}</dd>
      <dt>VAT code</dt><dd>{company.vatCode ?? "Not VAT-registered"}</dd>
      <dt>Email</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd>
    </dl>
  );
}
