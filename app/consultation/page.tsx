import type { Metadata } from "next";
import { ConsultationPage } from "@/components/sections/ConsultationPage";

export const metadata: Metadata = {
  title: "Бесплатная консультация | Asad Nazarov",
  description: "Заявка на персональную консультацию по внедрению ИИ в бизнес.",
};

export default function Page() {
  return <ConsultationPage />;
}
