import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal-document";
import { company } from "@/lib/company";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <LegalDocument
      title="Cookie Policy"
      updated="2026-09-29"
      intro={
        <p>
          {company.website} uses only cookies and browser storage that are strictly necessary for the Service you ask for. We do
          not use analytics, advertising or tracking cookies, so we do not show a cookie consent banner. If this changes, we will
          ask for your consent before setting any non-essential cookie.
        </p>
      }
    >
      <h2 id="what">1. What cookies and browser storage are</h2>
      <p>
        Cookies are small text files that a website stores in your browser. Browser storage (“local storage”) works similarly but
        stays on your device and is not sent to our servers automatically. Under Article 5(3) of the ePrivacy Directive and
        Article 61 of the Lithuanian Law on Electronic Communications, we may use them without consent only where they are
        strictly necessary to provide a service you have requested.
      </p>

      <h2 id="list">2. What we use</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Type</th><th>Purpose</th><th>Duration</th><th>Set by</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>access_token</code></td>
            <td>Cookie (HttpOnly, Secure, SameSite=Lax)</td>
            <td>Keeps you signed in. Contains a signed, short-lived token that identifies your account and session.</td>
            <td>15 minutes</td>
            <td>{company.website} (first party)</td>
          </tr>
          <tr>
            <td><code>refresh_token</code></td>
            <td>Cookie (HttpOnly, Secure, SameSite=Lax)</td>
            <td>Renews your sign-in securely so that you do not have to sign in every 15 minutes. It is replaced each time it is used and cancelled when you sign out.</td>
            <td>30 days</td>
            <td>{company.website} (first party)</td>
          </tr>
          <tr>
            <td><code>aigenerate:draft:&lt;account ID&gt;</code></td>
            <td>Local storage</td>
            <td>Saves a workspace draft (your prompt text and settings) in your browser, only when you click to save it. It is never sent to our servers. Reference images are not saved.</td>
            <td>Until you delete it or clear your browser data</td>
            <td>{company.website} (first party)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Both cookies are set only when you sign in or register, and are deleted when you sign out. All three items are strictly
        necessary for the functions you request, so they do not require consent.
      </p>

      <h2 id="third-parties">3. Third-party content</h2>
      <ul>
        <li>
          Our fonts are served from our own servers. Your browser does not connect to Google or any other font service.
        </li>
        <li>
          Our “page not found” screen plays a video delivered by Amazon CloudFront. Your browser connects to CloudFront to load
          it, which reveals your IP address and browser information to Amazon. No cookies are set by it on our behalf.
        </li>
        <li>
          If online checkout is enabled, the payment page or payment form of our payment provider may set its own strictly
          necessary cookies for fraud prevention and secure payment. The provider’s cookie notice is linked at checkout.
        </li>
        <li>
          Links to social networks are plain links. No social media plugins or tracking pixels are loaded.
        </li>
      </ul>

      <h2 id="control">4. How to control cookies</h2>
      <p>
        You can delete or block cookies and local storage in your browser settings. If you block our cookies, you will not be
        able to sign in. Deleting local storage removes saved drafts.
      </p>

      <h2 id="more">5. More information</h2>
      <p>
        For more on how we process personal data, see our <Link href="/legal/privacy">Privacy Policy</Link>. Questions:{" "}
        <a href={`mailto:${company.email}`}>{company.email}</a>.
      </p>
    </LegalDocument>
  );
}
