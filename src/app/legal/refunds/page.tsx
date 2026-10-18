import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal-document";
import { company } from "@/lib/company";

export const metadata: Metadata = { title: "Refund & Withdrawal Policy" };

export default function RefundsPage() {
  return (
    <LegalDocument
      title="Refund & Withdrawal Policy"
      updated="2026-09-29"
      intro={
        <>
          <p>In short:</p>
          <ul>
            <li>If you are a consumer, you can withdraw from a credit purchase within 14 days.</li>
            <li>
              Once you start generating with purchased credits and confirm that you lose your right of withdrawal, the credits you
              use are no longer refundable under that right.
            </li>
            <li>If a generation fails, its credits come back to your balance automatically.</li>
            <li>Unused purchased credits are refunded when you close your account.</li>
            <li>Your legal rights if the Service is faulty always apply.</li>
          </ul>
        </>
      }
    >
      <p>
        This policy is part of our <Link href="/legal/terms">Terms of Service</Link>. Terms such as “credits”, “Outputs” and
        “remaining purchase value” have the meanings given there. Sections 1 to 3 apply to consumers. Sections 4 to 8 apply to all
        customers unless stated otherwise.
      </p>

      <h2 id="withdrawal">1. Your 14-day right of withdrawal (consumers)</h2>
      <p>
        You have the right to withdraw from a contract for the purchase of credits within 14 days without giving any reason. The
        withdrawal period expires 14 days after the day on which the contract is concluded, which is the day we confirm your
        order.
      </p>
      <p>
        To exercise the right of withdrawal, you must inform us ({company.name}, {company.address},{" "}
        <a href={`mailto:${company.email}`}>{company.email}</a>) of your decision to withdraw from this contract by a clear
        statement (for example, an email). You may use the <a href="#model-form">model withdrawal form</a> below, but it is not
        obligatory. To meet the withdrawal deadline, it is sufficient for you to send your communication concerning your exercise
        of the right of withdrawal before the withdrawal period has expired. We will confirm receipt of your withdrawal by email
        without delay.
      </p>
      <h3>Effects of withdrawal</h3>
      <p>
        If you withdraw from this contract, we shall reimburse to you all payments received from you, subject to section 2,
        without undue delay and in any event not later than 14 days from the day on which we are informed about your decision to
        withdraw from this contract. We will carry out such reimbursement using the same means of payment as you used for the
        initial transaction, unless you have expressly agreed otherwise. In any event, you will not incur any fees as a result of
        such reimbursement. The withdrawn credits are removed from your balance.
      </p>

      <h2 id="waiver">2. When the right of withdrawal is lost (consumers)</h2>
      <p>
        Generated images and videos are digital content that is not supplied on a tangible medium. Under Article 16(m) of
        Directive 2011/83/EU and the corresponding provisions of the Lithuanian Civil Code on distance contracts, you lose your right of withdrawal once supply of
        the digital content has begun, if:
      </p>
      <ol>
        <li>you gave your prior express consent to begin supply during the withdrawal period;</li>
        <li>you acknowledged that you thereby lose your right of withdrawal; and</li>
        <li>we confirmed your consent and acknowledgement on a durable medium (by email).</li>
      </ol>
      <p>
        Before you first use purchased credits within the 14-day period, we ask you to give this consent and acknowledgement with
        a separate checkbox, which is never pre-ticked. You do not have to tick it; if you do not, you can wait until the
        withdrawal period ends before generating.
      </p>
      <p>
        <strong>What this means in practice.</strong> If you withdraw after using some purchased credits with this consent, you
        lose the right of withdrawal for the credits you have used, and we refund the remaining purchase value of your unused
        credits. If we did not obtain your consent and acknowledgement as described above, your right of withdrawal remains
        intact for the full purchase.
      </p>

      <h2 id="unused">3. Unused credits when your account closes (consumers)</h2>
      <ul>
        <li>
          If you close your account at any time, we refund the remaining purchase value of your unused purchased credits, within
          14 days of closure.
        </li>
        <li>
          If we close your account without fault on your part, stop providing the Service, or you close your account because you
          do not accept a change to our Terms that is to your disadvantage, we also refund the remaining purchase value of your
          unused purchased credits.
        </li>
        <li>Free, trial and promotional credits have no cash value and are not refunded.</li>
        <li>
          If we close your account because you seriously breached our Terms, the rules in section 15.2 of the Terms apply.
        </li>
      </ul>

      <h2 id="failed">4. Failed generations: automatic credit return (all customers)</h2>
      <p>
        When you start a generation, we reserve its credits. If the generation fails or is interrupted, including when an AI
        provider refuses the request, times out or returns an error, or our server restarts, all credits reserved for that
        generation are returned to your balance automatically. You do not need to ask. Your balance and the history in your
        workspace show the return. We do not automatically retry a failed paid generation, so you are never charged twice.
      </p>

      <h2 id="conformity">5. Faulty results and statutory remedies (consumers)</h2>
      <p>
        You have legal rights if the Service or a generated result is not in conformity with the contract, as set out in the
        Lithuanian Civil Code and the rules implementing Directive (EU) 2019/770. These rights cannot be excluded or limited and
        are not affected by the loss of the right of withdrawal.
      </p>
      <ul>
        <li>
          Examples of non-conformity: a file that is corrupt, blank or cannot be opened; a video shorter than the length you paid
          for; a result in a different format, size or quality level from the one selected; or a result clearly unrelated to
          your request.
        </li>
        <li>
          An Output that follows your request but that you do not like, or that shows the usual imperfections of AI-generated
          content, is not in itself a lack of conformity.
        </li>
        <li>
          <strong>Remedies.</strong> Contact us with the generation ID. We will first bring the result into conformity, free of
          charge, within a reasonable time, normally by returning the credits or re-running the generation. If that is not
          possible, if we fail to do so, or if the lack of conformity is serious, you may ask for a proportionate price
          reduction (as a credit return or a refund) or terminate the contract and receive a refund of the remaining purchase
          value and the value of the non-conforming generation.
        </li>
        <li>Report problems within a reasonable time. We handle them as complaints under section 7.</li>
      </ul>

      <h2 id="business">6. Business customers</h2>
      <p>
        The consumer right of withdrawal and sections 1 to 3 and 5 do not apply to business customers. Failed generations are
        returned automatically (section 4). We will consider requests to refund unused purchased credits in good faith, and we
        refund them if we end the contract without cause or stop providing the Service.
      </p>

      <h2 id="how">7. How to request a refund and how refunds are paid</h2>
      <ul>
        <li>
          Email <a href={`mailto:${company.email}`}>{company.email}</a> from your account email address, with the purchase
          concerned and the reason (a reason is not needed for withdrawal).
        </li>
        <li>We reply within 14 days. If you are not satisfied, see the complaint and dispute rules in section 16 of the Terms.</li>
        <li>
          Refunds are paid in the currency and by the payment method you used. If you paid by bank transfer, we refund to the
          same account. For card payments, the time until the money appears depends on your bank.
        </li>
        <li>We refund the amount you actually paid, including any VAT, not the credit price of generations.</li>
      </ul>

      <h2 id="chargebacks">8. Chargebacks and payment disputes</h2>
      <p>
        If something is wrong with a payment, please contact us first. We can usually resolve it faster than your bank. You keep
        the right to dispute a payment with your bank or card issuer at any time. While a chargeback is open, we may put the
        credits from that purchase on hold. If the chargeback is decided in your favour, those credits are removed. If it is
        decided in our favour, they are released. Fraudulent chargebacks are a serious breach of our Terms.
      </p>

      <h2 id="model-form">Model withdrawal form</h2>
      <p>
        (Complete and return this form only if you wish to withdraw from the contract. This form follows Annex I(B) to Directive
        2011/83/EU.)
      </p>
      <div className="legal-intro">
        <p>
          To: {company.name}, {company.address}, email: {company.email}
        </p>
        <p>
          I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract of sale of the following goods (*)/for the
          provision of the following service (*):
        </p>
        <p>Credit package: ____________________________________________</p>
        <p>Ordered on (*)/received on (*): ________________________________</p>
        <p>Name of consumer(s): _______________________________________</p>
        <p>Email address of your account: ________________________________</p>
        <p>Address of consumer(s): _____________________________________</p>
        <p>Signature of consumer(s) (only if this form is notified on paper): ____________</p>
        <p>Date: ____________</p>
        <p>(*) Delete as appropriate.</p>
      </div>
    </LegalDocument>
  );
}
