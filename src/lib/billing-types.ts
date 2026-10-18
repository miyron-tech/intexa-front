export type BillingDetails = { email?: string; firstName: string; lastName: string; addressLine1: string; city: string; countryCode: string; postalCode: string };
export type CreditPackage = { id: string; name: string; credits: number; monthlyCents: number };
export type CustomPackage = { minAmountCents: number; maxAmountCents: number; stepAmountCents: number; creditsPerStep: number; defaultAmountCents: number };
