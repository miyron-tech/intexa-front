import type { Metadata } from "next";
import Link from "next/link";
import { CompanyDetails, LegalDocument } from "@/components/legal-document";
import { company } from "@/lib/company";

export const metadata: Metadata = { title: "Legal Notice" };

export default function ImprintPage() {
  return (
    <LegalDocument title="Legal Notice" updated="2026-09-29">
      <p>{company.website} is operated by:</p>
      <CompanyDetails />

      <h2 id="contact">Contact</h2>
      <p>
        Email: <a href={`mailto:${company.email}`}>{company.email}</a>. We reply in English. This address is also for
        complaints, withdrawal requests, privacy requests and content reports.
      </p>

      <h2 id="dsa">Digital Services Act points of contact</h2>
      <ul>
        <li>
          <strong>For authorities</strong> (Article 11 DSA): member state authorities, the European Commission and the European
          Board for Digital Services can contact us at <a href={`mailto:${company.email}`}>{company.email}</a>. Languages:
          English and Lithuanian.
        </li>
        <li>
          <strong>For users and anyone else</strong> (Article 12 DSA): <a href={`mailto:${company.email}`}>{company.email}</a>.
          Languages: English and Lithuanian. You can also report illegal content as described in our{" "}
          <Link href="/legal/acceptable-use">Acceptable Use &amp; AI Content Policy</Link>.
        </li>
      </ul>

      <h2 id="authorities">Supervisory authorities</h2>
      <ul>
        <li>
          Consumer protection and out-of-court consumer dispute resolution: State Consumer Rights Protection Authority
          (Valstybinė vartotojų teisių apsaugos tarnyba),{" "}
          <a href="https://www.vvtat.lt" rel="noopener noreferrer" target="_blank">www.vvtat.lt</a>.
        </li>
        <li>
          Data protection: State Data Protection Inspectorate (Valstybinė duomenų apsaugos inspekcija),{" "}
          <a href="https://vdai.lrv.lt" rel="noopener noreferrer" target="_blank">vdai.lrv.lt</a>.
        </li>
        <li>
          Digital Services Coordinator for Lithuania: Communications Regulatory Authority (Ryšių reguliavimo tarnyba),{" "}
          <a href="https://www.rrt.lt" rel="noopener noreferrer" target="_blank">www.rrt.lt</a>.
        </li>
      </ul>

      <h2 id="ai">AI-generated content</h2>
      <p>
        This website lets users generate images and videos with artificial intelligence. Content produced in users’ workspaces
        is AI-generated.
      </p>
    </LegalDocument>
  );
}
