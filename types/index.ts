export type Locale = "ru" | "uz";

export type Role =
  | "owner"
  | "executive"
  | "manager"
  | "operations"
  | "technical"
  | "sales"
  | "marketing"
  | "finance"
  | "other";

export type CompanySize = "solo" | "2-10" | "11-50" | "51-200" | "200-plus";

export type AnnualRevenue = "under-100k" | "100k-500k" | "500k-1m" | "1m-2m" | "over-2m";

export type ProjectBudget = "under-10k" | "10k-50k" | "50k-100k" | "over-100k";

export type Interest =
  | "leads_sales"
  | "customer_support"
  | "internal_ops"
  | "data_reporting"
  | "content_marketing"
  | "not_sure";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface ProcessStep {
  title: string;
  tagline: string;
  bullets: string[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface ConsultationFormValues {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  companyWebsite?: string;
  role: Role;
  companySize: CompanySize;
  annualRevenue: AnnualRevenue;
  projectBudget: ProjectBudget;
  howCanWeHelp: string;
  interests: Interest[];
  additionalInfo?: string;
  locale: Locale;
}
