import type {
  AnnualRevenue,
  CompanySize,
  Interest,
  NavItem,
  ProcessStep,
  ProjectBudget,
  Role,
  SelectOption,
  Testimonial,
} from "@/types";

export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    items: NavItem[];
    cta: string;
  };
  hero: {
    overline: string;
    headline: string;
    headlineAccent: string;
    subhead: string;
    cta: string;
    statProjectsValue: string;
    statProjectsLabel: string;
    statCountries: string;
    founderLine: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    credentials: string[];
  };
  process: {
    eyebrow: string;
    heading: string;
    subhead: string;
    steps: ProcessStep[];
    ctaText: string;
    ctaButton: string;
  };
  testimonials: {
    eyebrow: string;
    heading: string;
    subhead: string;
    items: Testimonial[];
  };
  consultationPage: {
    backLabel: string;
    eyebrow: string;
    heading: string;
    subhead: string;
    priceLabel: string;
    priceNote: string;
  };
  form: {
    firstNameLabel: string;
    firstNamePlaceholder: string;
    lastNameLabel: string;
    lastNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    companyNameLabel: string;
    companyNamePlaceholder: string;
    companyWebsiteLabel: string;
    companyWebsitePlaceholder: string;
    roleLabel: string;
    roleOptions: SelectOption<Role>[];
    companySizeLabel: string;
    companySizeOptions: SelectOption<CompanySize>[];
    annualRevenueLabel: string;
    annualRevenueOptions: SelectOption<AnnualRevenue>[];
    projectBudgetLabel: string;
    projectBudgetOptions: SelectOption<ProjectBudget>[];
    howCanWeHelpLabel: string;
    howCanWeHelpPlaceholder: string;
    interestsLabel: string;
    interestsOptions: SelectOption<Interest>[];
    additionalInfoLabel: string;
    additionalInfoPlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    errorTitle: string;
    errorBody: string;
    errorFallbackCta: string;
    selectPlaceholder: string;
    validation: {
      firstNameRequired: string;
      lastNameRequired: string;
      emailInvalid: string;
      companyNameRequired: string;
      companyWebsiteInvalid: string;
      roleRequired: string;
      companySizeRequired: string;
      annualRevenueRequired: string;
      projectBudgetRequired: string;
      howCanWeHelpRequired: string;
      interestsRequired: string;
    };
  };
  footer: {
    tagline: string;
    contactHeading: string;
    email: string;
    telegram: string;
    socialsHeading: string;
    rights: string;
    privacy: string;
    terms: string;
  };
  legal: {
    privacyTitle: string;
    privacyBody: string[];
    termsTitle: string;
    termsBody: string[];
    backLabel: string;
  };
}
