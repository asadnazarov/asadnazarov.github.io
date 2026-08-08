export const SITE_NAME = "Asad Nazarov";
export const SITE_URL = "https://asadnazarov.ai";

export const SOCIALS = {
  telegram: "https://t.me/+sYvEnKnzLb03MGU6",
  instagram: "https://www.instagram.com/asadnazarov_ai/",
};

export const CONTACT_EMAIL = "asadnazarov077@gmail.com";

// Supabase Edge Function endpoint for the consultation form.
// The anon key is a public, publishable key by design (Supabase docs) —
// it only allows calling this specific edge function, never exposes secrets.
export const SUPABASE_URL = "https://cukgjtedqppxjnoxnhtu.supabase.co";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1a2dqdGVkcXBweGpub3huaHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMTQ1OTcsImV4cCI6MjEwMTU5MDU5N30.3f3ljP76GNcWirOY8Yzq8aVF1_HbgY6xpUIJN4A2DCs";
export const CONSULTATION_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/consultation`;
