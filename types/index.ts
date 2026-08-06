export type Locale = "ru" | "uz";

export type ConsultationNeed = "implementation" | "training" | "consultation" | "other";

export interface CaseStudy {
  number: string;
  industry: string;
  challenge: string;
  solution: string;
  result: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface BudgetOption {
  value: string;
  label: string;
}

export interface NeedOption {
  value: ConsultationNeed;
  label: string;
}

export interface ConsultationFormValues {
  name: string;
  contact: string;
  company?: string;
  need: ConsultationNeed;
  budget: string;
  message: string;
  locale: Locale;
}
