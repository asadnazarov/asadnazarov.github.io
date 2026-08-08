import { z } from "zod";

const roles = [
  "owner",
  "executive",
  "manager",
  "operations",
  "technical",
  "sales",
  "marketing",
  "finance",
  "other",
] as const;

const companySizes = ["solo", "2-10", "11-50", "51-200", "200-plus"] as const;

const annualRevenues = ["under-100k", "100k-500k", "500k-1m", "1m-2m", "over-2m"] as const;

const projectBudgets = ["under-10k", "10k-50k", "50k-100k", "over-100k"] as const;

const interests = [
  "leads_sales",
  "customer_support",
  "internal_ops",
  "data_reporting",
  "content_marketing",
  "not_sure",
] as const;

export const consultationSchema = z.object({
  firstName: z.string().trim().min(2, "firstNameRequired"),
  lastName: z.string().trim().min(2, "lastNameRequired"),
  email: z.string().trim().email("emailInvalid"),
  companyName: z.string().trim().min(2, "companyNameRequired"),
  companyWebsite: z
    .string()
    .trim()
    .refine((val) => val === "" || /^https?:\/\/.+\..+/.test(val), "companyWebsiteInvalid")
    .optional()
    .or(z.literal("")),
  role: z.enum(roles, { message: "roleRequired" }),
  companySize: z.enum(companySizes, { message: "companySizeRequired" }),
  annualRevenue: z.enum(annualRevenues, { message: "annualRevenueRequired" }),
  projectBudget: z.enum(projectBudgets, { message: "projectBudgetRequired" }),
  howCanWeHelp: z.string().trim().min(10, "howCanWeHelpRequired"),
  interests: z.array(z.enum(interests)).min(1, "interestsRequired"),
  additionalInfo: z.string().trim().optional().or(z.literal("")),
  locale: z.enum(["ru", "uz"]),
});

export type ConsultationSchema = z.infer<typeof consultationSchema>;
