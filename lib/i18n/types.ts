import type { BudgetOption, CaseStudy, NavItem, NeedOption, Testimonial } from "@/types";

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
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
  };
  about: {
    heading: string;
    paragraphs: string[];
    credentials: string[];
  };
  cases: {
    heading: string;
    subhead: string;
    items: CaseStudy[];
    labels: {
      challenge: string;
      solution: string;
      result: string;
    };
  };
  testimonials: {
    heading: string;
    items: Testimonial[];
  };
  consultation: {
    heading: string;
    subhead: string;
    price: string;
    priceNote: string;
    outcomes: { title: string; description: string }[];
    processHeading: string;
    processSteps: string[];
  };
  form: {
    nameLabel: string;
    namePlaceholder: string;
    contactLabel: string;
    contactPlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    needLabel: string;
    needOptions: NeedOption[];
    budgetLabel: string;
    budgetOptions: BudgetOption[];
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    errorTitle: string;
    errorBody: string;
    errorFallbackCta: string;
    validation: {
      nameRequired: string;
      contactRequired: string;
      needRequired: string;
      budgetRequired: string;
      messageRequired: string;
    };
  };
  footer: {
    tagline: string;
    contactHeading: string;
    email: string;
    telegram: string;
    socialsHeading: string;
    rights: string;
  };
}
