import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal-document";
import { company } from "@/lib/company";

export const metadata: Metadata = { title: "Acceptable Use Policy" };

export default function AcceptableUsePage() {
  return (
    <LegalDocument
      title="Acceptable Use & AI Content Policy"
      updated="2026-09-29"
      intro={
        <p>
          This policy is part of our <Link href="/legal/terms">Terms of Service</Link>. It sets out what you may and may not
          create with {company.website}, your responsibilities when you use AI-generated content, and how we handle reports of
          illegal content under the EU Digital Services Act (DSA). It applies to everything you submit (Inputs) and everything
          generated for you (Outputs).
        </p>
      }
    >
      <h2 id="prohibited">1. Prohibited content and uses</h2>
      <p>You must not use the Service to create, upload, request or distribute content that:</p>
      <ol>
        <li>
          <strong>sexualises minors</strong> in any way, including drawings or AI-generated depictions of anyone who is or
          appears to be under 18. We report child sexual abuse material to the competent authorities;
        </li>
        <li>
          is <strong>sexually explicit or intimate content of a real, identifiable person</strong>, or “undresses” or sexualises
          a real person, whether or not they consented. Sexually explicit content in general is not permitted on the Service;
        </li>
        <li>
          is a <strong>deep fake of a real person</strong> (an image or video that falsely appears to show a real, identifiable
          person saying or doing something) without that person’s consent, or that is used to deceive, defame, harass,
          impersonate or manipulate, including in elections or political campaigns;
        </li>
        <li>
          <strong>infringes the rights of others</strong>, including copyright, trade marks, design rights, personality and image
          rights, or privacy. This includes uploading photos you have no right to use and creating counterfeit product images;
        </li>
        <li>
          promotes, glorifies or incites <strong>terrorism, violence or hatred</strong> against people based on protected
          characteristics, or depicts extreme gore or cruelty;
        </li>
        <li>
          is used for <strong>fraud or deception</strong>, including fake documents, IDs, receipts, reviews, product
          photos that misrepresent goods offered for sale, phishing, scams or fake evidence;
        </li>
        <li>
          harasses, bullies, threatens or discloses private information about others, or encourages self-harm or suicide;
        </li>
        <li>
          concerns weapons of mass destruction, illegal drugs or other illegal goods and services, in a way that facilitates
          harm;
        </li>
        <li>is otherwise illegal under EU law, Lithuanian law or the law of the country where you use it; or</li>
        <li>
          is used for any practice prohibited under Article 5 of the EU AI Act, for example manipulating people through
          subliminal or deceptive techniques to cause them significant harm.
        </li>
      </ol>
      <p>You must also not:</p>
      <ul>
        <li>try to bypass our or our AI providers’ safety filters, for example by encoding or disguising prohibited requests;</li>
        <li>attack, overload, scrape or reverse-engineer the Service, or access it with bots except through tools we provide;</li>
        <li>resell access to the Service or share accounts; or</li>
        <li>use the Service in breach of EU, UN, UK or US sanctions.</li>
      </ul>

      <h2 id="people">2. Photos and likenesses of real people</h2>
      <ul>
        <li>
          Upload photos of a person only if you are that person or you have their consent to create AI images of them for the
          intended purpose. Tools that process photos of people ask you to confirm this each time.
        </li>
        <li>Do not upload photos of anyone under 18 to tools that edit or generate images of people.</li>
        <li>
          Do not use AI images of a real person in a way that could mislead others about who they are, what they did or what
          they endorse.
        </li>
      </ul>

      <h2 id="labelling">3. Labelling AI-generated content</h2>
      <ul>
        <li>
          Outputs are created by AI. Where the law requires it, including Article 50(4) of the EU AI Act, you must clearly
          disclose that realistic images or videos that resemble real people, objects, places or events (“deep fakes”) are
          AI-generated when you publish them. For evidently artistic, creative, satirical or fictional works, the disclosure may
          be made in a way that does not spoil the work.
        </li>
        <li>
          Outputs may include technical markers, such as metadata or invisible watermarks, identifying them as AI-generated.
          Do not remove, alter or obscure them to deceive anyone.
        </li>
        <li>
          Follow the rules of the platforms and marketplaces where you publish Outputs, including their rules on AI-generated
          product images and advertising. Product images must not misrepresent the product you sell.
        </li>
      </ul>

      <h2 id="moderation">4. How we moderate content</h2>
      <p>
        We store your Inputs and Outputs in your private workspace. We do not publish them or make them available to other
        users. We moderate content as follows:
      </p>
      <ul>
        <li>
          <strong>Automated filters.</strong> Our AI providers apply automated safety systems that may refuse a request or block
          a result. When this happens, the generation fails and its credits are returned automatically.
        </li>
        <li>
          <strong>Human review.</strong> Our authorised staff review content when we receive a notice or complaint, when an
          authority orders us to, or when we have concrete indications of misuse (for example, repeated blocked requests). We
          do not routinely review private content.
        </li>
        <li>
          <strong>Measures we may take</strong>, proportionate to the seriousness of the breach: refusing a request, deleting
          or disabling access to specific content, issuing a warning, temporarily suspending the account, or closing it. We
          close accounts immediately for child sexual abuse material or non-consensual intimate imagery.
        </li>
        <li>
          When deciding, we act diligently, objectively and proportionately, and we take into account the rights and
          legitimate interests of everyone involved, including freedom of expression.
        </li>
      </ul>

      <h2 id="notice">5. Reporting illegal content (notice and action)</h2>
      <p>
        Anyone, with or without an account, can report content on the Service that they believe is illegal or breaches this
        policy (Article 16 DSA). Send your notice to <a href={`mailto:${company.email}`}>{company.email}</a> with the subject
        line “Content report”. Please include:
      </p>
      <ol>
        <li>a sufficiently substantiated explanation of why you believe the content is illegal or breaches this policy;</li>
        <li>
          information that lets us locate the content, such as the link, the generation ID or the account concerned, and
          anything else that identifies it;
        </li>
        <li>
          your name and email address (not required if the report concerns child sexual abuse material or related offences);
          and
        </li>
        <li>
          a statement that you believe in good faith that the information and allegations in the notice are accurate and
          complete.
        </li>
      </ol>
      <p>
        We confirm receipt without undue delay, process the notice in a timely, diligent, non-arbitrary and objective manner,
        and tell you our decision and the possible ways to challenge it. We will tell you if we used automated means to
        process or decide on your notice. If your photo was uploaded without your consent, you can use this procedure too.
      </p>
      <p>
        If content indicates a criminal offence involving a threat to the life or safety of a person, we inform the competent
        law enforcement or judicial authorities as required by Article 18 DSA. We may stop processing notices from people who
        frequently submit manifestly unfounded reports, after warning them.
      </p>

      <h2 id="reasons">6. Statement of reasons</h2>
      <p>
        If we remove or disable your content, suspend or close your account or restrict your use of the Service because your
        content is illegal or breaches our terms, we send you a clear and specific statement of reasons (Article 17 DSA) by email
        at the latest when the restriction takes effect, unless the law prohibits it or you gave us no contact details. It
        states:
      </p>
      <ul>
        <li>what we did, its scope and, where applicable, its duration;</li>
        <li>the facts and circumstances relied on, including whether we acted on a notice;</li>
        <li>whether automated means were used to detect the content or take the decision;</li>
        <li>the legal ground (if the content is considered illegal) or the term of our policy (if it breaches our terms); and</li>
        <li>how you can challenge the decision.</li>
      </ul>

      <h2 id="appeal">7. Challenging a decision</h2>
      <p>
        If you disagree with a decision we made about your notice, your content or your account, reply to our email or write to{" "}
        <a href={`mailto:${company.email}`}>{company.email}</a> with the subject line “Appeal” within six months. A person who was
        not involved in the original decision will review it and reply, normally within 14 days. We will reverse our decision if
        the content or conduct was not illegal or in breach of our terms. You can also go to court, and consumers can use the
        dispute routes described in section 16 of our <Link href="/legal/terms">Terms of Service</Link>.
      </p>

      <h2 id="authorities">8. Contact point for authorities</h2>
      <p>
        EU member state authorities, the European Commission and the European Board for Digital Services can contact us at{" "}
        <a href={`mailto:${company.email}`}>{company.email}</a> in English or Lithuanian. See our{" "}
        <Link href="/legal/imprint">Legal Notice</Link>.
      </p>
    </LegalDocument>
  );
}
