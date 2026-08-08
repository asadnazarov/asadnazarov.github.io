import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: "Условия использования | Asad Nazarov",
};

export default function Page() {
  return <LegalPage variant="terms" />;
}
