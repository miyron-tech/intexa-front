import Link from "next/link";
import { company, legalLinks } from "@/lib/company";
import "./site-legal-footer.css";

// Company identification required on the site (LT Law on Companies, E-Commerce Directive Art. 5).
export function SiteLegalFooter() {
  return (
    <div className="site-legal-footer">
      <nav aria-label="Legal">
        {legalLinks.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>
      <address>
        <span>{company.name}</span>
        <span>Company code {company.code}</span>
        <span>{company.address}</span>
        <a href={`mailto:${company.email}`}>{company.email}</a>
      </address>
    </div>
  );
}
