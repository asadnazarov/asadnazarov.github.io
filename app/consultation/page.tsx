import type { Metadata } from "next";
import { ConsultationPage } from "@/components/sections/ConsultationPage";

export const metadata: Metadata = {
  title: "Консультация — $100 | Asad Nazarov",
  description: "Заявка на персональную консультацию по внедрению ИИ в бизнес.",
};

export default function Page() {
  return <ConsultationPage />;
}
