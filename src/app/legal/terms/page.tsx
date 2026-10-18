import type { Metadata } from "next";
import Link from "next/link";
import { CompanyDetails, LegalDocument } from "@/components/legal-document";
import { company } from "@/lib/company";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      updated="2026-09-29"
      intro={
        <p>
          These Terms govern your use of {company.website} (the “Service”). They form a contract between you and {company.name}.
          Please read them before you create an account or buy credits. Where a rule applies only to consumers or only to
          business customers, we say so. Nothing in these Terms limits rights you have as a consumer under mandatory law.
        </p>
      }
    >
      <h2 id="who-we-are">1. Who we are</h2>
      <p>The Service is provided by:</p>
      <CompanyDetails />
      <p>
        You can contact us by email at <a href={`mailto:${company.email}`}>{company.email}</a>. More details, including our
        points of contact under the Digital Services Act, are in our <Link href="/legal/imprint">Legal Notice</Link>.
      </p>

      <h2 id="documents">2. Documents that form the contract</h2>
      <p>Your contract with us consists of:</p>
      <ul>
        <li>these Terms of Service;</li>
        <li>the <Link href="/legal/acceptable-use">Acceptable Use &amp; AI Content Policy</Link>;</li>
        <li>the <Link href="/legal/refunds">Refund &amp; Withdrawal Policy</Link>; and</li>
        <li>the price and credit information shown to you before each purchase and before each generation.</li>
      </ul>
      <p>
        Our <Link href="/legal/privacy">Privacy Policy</Link> and <Link href="/legal/cookies">Cookie Policy</Link> explain how
        we handle personal data. They are information notices, not contract terms. If documents conflict, these Terms prevail,
        except that the Refund &amp; Withdrawal Policy prevails on refunds and withdrawal.
      </p>

      <h2 id="service">3. What the Service does</h2>
      <p>
        The Service lets you create images and videos with artificial intelligence (“AI”). You provide a text description,
        settings and, for some tools, reference images (together, “Inputs”). We send your Inputs to third-party AI models and
        return the generated images or videos (“Outputs”) to your personal workspace.
      </p>
      <ul>
        <li>
          <strong>You are interacting with AI.</strong> Outputs are produced automatically by AI models. They may be
          inaccurate, unexpected or similar to content created for other users. They are not reviewed by a human before you
          receive them.
        </li>
        <li>
          Before each generation, we show you its price in credits. We may prepare a model prompt from your description (for
          example, by translating it into English) using a text AI model.
        </li>
        <li>
          The AI models we use may change over time. We will keep the Service materially equivalent to what you paid for, and
          we will tell you in advance about changes that materially reduce it (see section 13).
        </li>
      </ul>

      <h2 id="eligibility">4. Who may use the Service</h2>
      <ul>
        <li>You must be at least <strong>18 years old</strong> and able to enter into a binding contract.</li>
        <li>
          If you use the Service for a company or other organisation, you confirm that you are authorised to accept these Terms
          on its behalf. In that case “you” includes that organisation, and you are a “business customer”.
        </li>
        <li>
          You may not use the Service if you are subject to EU, UN, UK or US sanctions, or if providing the Service to you would
          breach sanctions law. We may refuse or end the Service where sanctions law requires it.
        </li>
      </ul>

      <h2 id="account">5. Your account</h2>
      <ul>
        <li>You need an account to generate content. Give us a valid email address that you control.</li>
        <li>
          Keep your password confidential. You are responsible for activity in your account unless it happened because we failed
          to protect it. Tell us at once if you suspect unauthorised access. On request, we can end all your active sessions.
        </li>
        <li>One person or organisation may not open multiple accounts to obtain free credits or to evade a suspension.</li>
        <li>Accounts are personal. You may not sell, transfer or share your account.</li>
      </ul>

      <h2 id="credits">6. Credits</h2>
      <h3>6.1 What credits are</h3>
      <p>
        Generations are paid for with credits. Credits are a prepaid unit of account for using the Service. They are{" "}
        <strong>not money, not electronic money and not a deposit</strong>. They cannot be transferred to another account,
        exchanged for cash or used outside the Service, except for the refunds described in the{" "}
        <Link href="/legal/refunds">Refund &amp; Withdrawal Policy</Link>.
      </p>
      <h3>6.2 Credit prices of generations</h3>
      <p>
        The number of credits each generation costs depends on the tool, number of variants, quality and, for video, its
        length. The current credit price is shown before you start each generation. If a credit price changes, the change never
        applies to a generation you have already started, and if you have the old price on screen, we will ask you to reload and
        confirm the new price first.
      </p>
      <h3>6.3 Reserving and using credits</h3>
      <ul>
        <li>When you start a generation, we reserve the displayed number of credits from your balance.</li>
        <li>When the generation completes, the reserved credits are used.</li>
        <li>
          If the generation fails or is interrupted on our side or at the AI provider, all reserved credits for that generation
          are <strong>returned to your balance automatically</strong>.
        </li>
        <li>Submitting the same request twice will not charge you twice.</li>
      </ul>
      <h3>6.4 Free and promotional credits</h3>
      <p>
        We may give free trial or promotional credits. We will tell you when you receive them whether they have any conditions,
        such as an expiry date. Free credits have no cash value and are not refundable.
      </p>
      <h3>6.5 Expiry</h3>
      <p>
        Purchased credits do not expire while your account is open. If we ever introduce an expiry date for new credit
        packages, we will state it clearly before you buy, and it will not apply to credits you bought earlier.
      </p>
      <h3>6.6 Remaining purchase value</h3>
      <p>
        Where these Terms refer to the “remaining purchase value” of unused credits, we mean the part of the amount you actually
        paid for credits that has not yet been used. Each credit you use takes a proportional share of the paid value of your
        whole balance (so if your balance includes free credits, they reduce the value of each credit proportionally). Your
        remaining purchase value is recorded in our accounts and we will tell you the amount on request.
      </p>

      <h2 id="buying">7. Buying credits, prices and payment</h2>
      <h3>7.1 How you buy</h3>
      <p>You can buy credit packages in either of two ways, depending on what is available when you buy:</p>
      <ul>
        <li>
          <strong>Online checkout</strong>: select a package, review the order summary and total price, and confirm with the
          order button that clearly states that you must pay; or
        </li>
        <li>
          <strong>Via our support team</strong>: contact us, and we will confirm the package, total price and payment method in
          writing before you pay.
        </li>
      </ul>
      <p>
        The contract for a credit package is concluded when we confirm your order. Credits are added to your account once your
        payment is received. We confirm every purchase by email (a durable medium), including the package, price, these Terms
        and the status of your right of withdrawal.
      </p>
      <h3>7.2 Prices and taxes</h3>
      <ul>
        <li>
          Prices shown to consumers are final prices and include any value added tax (VAT) or other taxes that we must charge.
          If VAT applies, it is calculated at the rate of the country where you live, and the order summary shows it.
        </li>
        <li>
          Business customers see prices both with and without VAT where VAT applies. If you give us a valid VAT number from
          another EU member state, the reverse-charge mechanism may apply, and you account for the VAT yourself.
        </li>
        <li>We do not charge extra fees for any payment method, and we never add paid extras with pre-ticked boxes.</li>
        <li>
          We may change package prices for future purchases at any time. A price change never affects credits you have already
          bought.
        </li>
      </ul>
      <h3>7.3 Payment</h3>
      <p>
        Card payments are processed by an independent payment service provider named at checkout. We do not receive or store
        your full card number. Your bank or card issuer may apply its own charges, for example for currency conversion.
      </p>
      <h3>7.4 Invoices</h3>
      <p>We issue a receipt or invoice for every purchase. Business customers may ask us to include their company details.</p>

      <h2 id="withdrawal">8. Right of withdrawal (consumers)</h2>
      <p>
        If you are a consumer, you have a 14-day right to withdraw from a credit purchase. If you ask us to start supplying
        generated content during that period and acknowledge the loss of your right of withdrawal, you lose it for the credits
        you have used. Full details, exceptions and the model withdrawal form are in the{" "}
        <Link href="/legal/refunds">Refund &amp; Withdrawal Policy</Link>.
      </p>

      <h2 id="content">9. Your Inputs and our Outputs</h2>
      <h3>9.1 Your Inputs</h3>
      <ul>
        <li>You keep all rights you have in your Inputs.</li>
        <li>
          You confirm that you own your Inputs or have every permission needed to use them in the Service. For photos of people,
          this includes the consent of each identifiable person. You must not upload photos of anyone under 18 to tools that edit or generate images of people.
        </li>
        <li>
          You give us a non-exclusive, worldwide, royalty-free licence to store, copy, adapt and transmit your Inputs only as
          needed to provide the Service to you, to keep it secure, to handle your support requests and to comply with the law.
          The licence ends when the Inputs are deleted, except where we must keep data by law.
        </li>
        <li>We do not use your Inputs or Outputs to train AI models, and we do not publish them.</li>
      </ul>
      <h3>9.2 Outputs</h3>
      <ul>
        <li>
          As between you and us, you may use your Outputs for any lawful purpose, including commercial purposes, subject to the{" "}
          <Link href="/legal/acceptable-use">Acceptable Use &amp; AI Content Policy</Link>. To the extent we have any rights in
          an Output, we assign them to you, or, where an assignment is not possible, we grant you an exclusive, perpetual,
          worldwide, royalty-free licence.
        </li>
        <li>
          <strong>No guarantee of ownership or uniqueness.</strong> Under current law, content created by AI may not be
          protected by copyright. Similar Outputs may be created for others. We do not promise that you will own copyright in
          an Output or that you can stop others using similar content.
        </li>
        <li>
          Outputs may unintentionally resemble third-party works, trade marks or real people. Check an Output before you use it
          commercially, particularly in advertising, product listings or anything involving a real person or brand.
        </li>
        <li>
          Outputs may carry visible or invisible markers (such as metadata or watermarks) identifying them as AI-generated. Do
          not remove or alter them where the law or our Acceptable Use Policy requires them to stay.
        </li>
        <li>
          If you publish realistic AI-generated images or videos that could be mistaken for real events or real people, you must
          disclose that they are AI-generated where the law requires, including under Article 50 of the EU AI Act.
        </li>
      </ul>
      <h3>9.3 Our intellectual property</h3>
      <p>
        The Service, its software, design, templates, presets and brand belong to us or our licensors. We grant you a personal,
        non-transferable right to use the Service under these Terms. You must not copy, reverse-engineer or resell the Service,
        or access it by automated means except through features we provide for that purpose.
      </p>

      <h2 id="acceptable-use">10. Acceptable use and content moderation</h2>
      <p>
        You must follow our <Link href="/legal/acceptable-use">Acceptable Use &amp; AI Content Policy</Link>. It lists
        prohibited content, explains how we and our AI providers may block or remove content, how you can report illegal
        content, how we inform you of our decisions and how you can challenge them. Our AI providers may automatically refuse
        requests that break their safety rules. If a request is refused, the reserved credits are returned.
      </p>

      <h2 id="availability">11. Availability and support</h2>
      <ul>
        <li>
          We aim to keep the Service available at all times, but it may be interrupted for maintenance, updates or reasons
          beyond our control, such as outages at AI providers.
        </li>
        <li>
          We will supply the Service in conformity with this contract. If it is not in conformity, you have the legal remedies
          described in section 12.
        </li>
        <li>Support is provided by email in English. We aim to reply within 2 business days.</li>
      </ul>

      <h2 id="conformity">12. Conformity and your legal remedies (consumers)</h2>
      <p>
        As a consumer, you are entitled to a Service that conforms to this contract and to EU and Lithuanian law, including the
        rules implementing Directive (EU) 2019/770 on digital content and digital services. If a generation or the Service is
        not in conformity, you may ask us to bring it into conformity (for example, by re-running the generation or returning
        the credits). If we do not do so within a reasonable time, or the lack of conformity is serious, you may ask for a
        proportionate price reduction or end the contract and get a refund, as described in the{" "}
        <Link href="/legal/refunds">Refund &amp; Withdrawal Policy</Link>. These rights cannot be excluded.
      </p>
      <p>
        Note that AI Outputs are creative and variable by nature. An Output that follows your request but is not to your taste
        is not, on its own, a lack of conformity. An Output that is corrupt, blank, clearly unrelated to your request or not in
        the format or length you paid for is.
      </p>

      <h2 id="liability">13. Liability</h2>
      <h3>13.1 All users</h3>
      <p>We are fully liable, without limitation, for:</p>
      <ul>
        <li>death or personal injury caused by our negligence;</li>
        <li>damage caused intentionally or by gross negligence;</li>
        <li>fraud; and</li>
        <li>any other liability that cannot be limited or excluded by law.</li>
      </ul>
      <h3>13.2 Consumers</h3>
      <p>
        We are responsible for loss or damage you suffer that is a foreseeable result of our breach of these Terms or our
        negligence. We are not responsible for loss that was not foreseeable when the contract was made. The Service is for
        personal and small-scale creative use; if you use it for business purposes, we are not liable to you as a consumer for
        loss of profit, business or business opportunity.
      </p>
      <h3>13.3 Business customers</h3>
      <p>Except as stated in section 13.1:</p>
      <ul>
        <li>
          we are not liable for loss of profit, revenue, business, goodwill or data, or for indirect or consequential loss; and
        </li>
        <li>
          our total liability arising from or in connection with the Service in any 12-month period is limited to the amount you
          paid us for credits in that period.
        </li>
      </ul>
      <p>
        The Service is provided to business customers as it is available. Statutory warranties that can be excluded between
        businesses are excluded.
      </p>
      <h3>13.4 Your responsibility</h3>
      <p>
        You are responsible for your Inputs and for how you use Outputs. If you are a business customer, you will compensate us
        for reasonable losses, including reasonable legal costs, that we suffer because of third-party claims arising from your
        Inputs or your use of Outputs in breach of these Terms. Consumers are liable under the general rules of law.
      </p>

      <h2 id="changes">14. Changes to the Service and these Terms</h2>
      <ul>
        <li>
          We may change the Service or these Terms for valid reasons, such as legal or regulatory changes, security, changes at
          AI providers, new features or to correct errors.
        </li>
        <li>
          We will notify you by email or in the Service at least <strong>30 days</strong> before a change that is materially to
          your disadvantage takes effect. Urgent changes required by law or for security may take effect sooner.
        </li>
        <li>
          If you do not agree to such a change, you may close your account before it takes effect. If you are a consumer, we
          will then refund the purchase value of your unused purchased credits. Changes never affect a generation already started.
        </li>
        <li>Minor changes that do not disadvantage you (for example, clearer wording) may take effect when published.</li>
      </ul>

      <h2 id="termination">15. Ending the contract</h2>
      <h3>15.1 By you</h3>
      <p>
        You may close your account at any time by emailing us from your account email address. If you are a consumer, we refund
        the remaining purchase value of your unused purchased credits when you close your account, as described in the{" "}
        <Link href="/legal/refunds">Refund &amp; Withdrawal Policy</Link>.
      </p>
      <h3>15.2 By us</h3>
      <ul>
        <li>
          We may suspend or close your account if you seriously or repeatedly breach these Terms or the Acceptable Use Policy,
          if we are required to by law or by an authority, or to prevent fraud or harm. Where possible and appropriate, we will
          warn you first and give you a chance to fix the problem. We will give you a statement of reasons explaining our
          decision and how to challenge it.
        </li>
        <li>
          We may also end the contract for any other reason, or stop providing the Service, by giving you at least 30 days’
          notice. In that case, we refund the remaining purchase value of your unused purchased credits.
        </li>
        <li>
          If we close your account because you seriously breached these Terms (for example, by creating illegal content or
          committing payment fraud), we may keep the value of credits needed to cover our losses, to the extent the law allows.
          Any remaining purchase value of unused purchased credits will be refunded.
        </li>
      </ul>
      <h3>15.3 Your content when the contract ends</h3>
      <p>
        Before your account is closed, you can download your Outputs. After closure, we delete your account data as described in
        the <Link href="/legal/privacy">Privacy Policy</Link>, except data we must keep by law.
      </p>

      <h2 id="complaints">16. Complaints</h2>
      <ul>
        <li>
          Send complaints to <a href={`mailto:${company.email}`}>{company.email}</a> with your account email, a description of
          the problem, the generation or order concerned (if any) and what you would like us to do.
        </li>
        <li>We reply in writing within <strong>14 days</strong> of receiving your complaint.</li>
        <li>
          If you are a consumer and are not satisfied with our answer, or we do not reply, you can refer the dispute free of
          charge to the Lithuanian out-of-court consumer dispute resolution body: the State Consumer Rights Protection Authority
          (Valstybinė vartotojų teisių apsaugos tarnyba, VVTAT), Vilniaus g. 25, 01402 Vilnius, Lithuania,{" "}
          <a href="https://www.vvtat.lt" rel="noopener noreferrer" target="_blank">www.vvtat.lt</a>. You must apply within one
          year of your complaint to us. Consumers in other EU countries can also get help from the European Consumer Centre in
          their country.
        </li>
        <li>We participate in dispute resolution before VVTAT.</li>
      </ul>

      <h2 id="law">17. Governing law and courts</h2>
      <ul>
        <li>These Terms are governed by the laws of the Republic of Lithuania.</li>
        <li>
          If you are a consumer living in another country, you keep the protection of the mandatory consumer laws of your country
          of residence. You may bring proceedings in the courts of your country of residence or in Lithuania, and we may bring
          proceedings against you only in the courts of your country of residence.
        </li>
        <li>
          If you are a business customer, the courts of the Republic of Lithuania have exclusive jurisdiction, with the court
          determined by our registered office.
        </li>
        <li>The United Nations Convention on Contracts for the International Sale of Goods does not apply.</li>
      </ul>

      <h2 id="general">18. General</h2>
      <ul>
        <li>
          We may transfer this contract to another company as part of a reorganisation or sale of our business. We will tell
          you, and your rights under these Terms, including as a consumer, will not be reduced. You may not transfer this
          contract without our consent.
        </li>
        <li>If a court finds part of these Terms invalid, the rest remains in effect.</li>
        <li>If we do not enforce a right immediately, we can still enforce it later.</li>
        <li>
          These Terms are available in English. We will send you a copy on request, and the version in force when you buy is included
          with your purchase confirmation email.
        </li>
      </ul>
    </LegalDocument>
  );
}
