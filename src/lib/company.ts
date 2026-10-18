// Legal entity operating intexa-ai.com. Single source for the footer, legal pages and metadata.
export const company = {
  name: "Intexa Group UAB",
  legalForm: "UAB (Uždaroji akcinė bendrovė) — private limited liability company",
  code: "307638275",
  registry: "Register of Legal Entities of the Republic of Lithuania (Registrų centras)",
  registeredOn: "2026-04-10",
  address: "Vištyčio g. 43A, Kybartai, LT-70428, Vilkaviškio r. sav., Lithuania",
  country: "Lithuania",
  // Not VAT-registered at the time of writing; set the LT VAT code here once issued.
  vatCode: null as string | null,
  // TODO: confirm this mailbox exists before launch.
  email: "support@intexa-ai.com",
  website: "intexa-ai.com",
} as const;

export const legalLinks = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/refunds", label: "Refund & Withdrawal Policy" },
  { href: "/legal/acceptable-use", label: "Acceptable Use Policy" },
  { href: "/legal/imprint", label: "Legal Notice" },
] as const;
