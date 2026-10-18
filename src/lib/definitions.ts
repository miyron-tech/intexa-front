import * as z from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Enter a valid email address" }));

export const LoginSchema = z.object({
  email,
  password: z.string().min(1, { error: "Enter your password" }).max(128),
});

export const RegisterSchema = z
  .object({
    email,
    password: z
      .string()
      .min(8, { error: "Use at least 8 characters" })
      .max(128, { error: "Use no more than 128 characters" })
      .regex(/[A-Za-zА-Яа-яЁё]/, { error: "Include at least one letter" })
      .regex(/\d/, { error: "Include at least one number" }),
    confirmPassword: z.string(),
    acceptTerms: z.literal("on", {
      error: "Accept the Terms of Service to create an account",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormState =
  | {
      errors?: Partial<
        Record<
          "email" | "password" | "confirmPassword" | "acceptTerms",
          string[]
        >
      >;
      message?: string;
      /** Keeps the typed email so the field is not cleared after an error */
      email?: string;
    }
  | undefined;
