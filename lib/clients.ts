export type CountryCode = "UZ" | "GB" | "US" | "MD";

export interface Client {
  src: string;
  name: string;
  country: CountryCode;
}

export const CLIENTS: Client[] = [
  { src: "/images/clients/agiron.png", name: "AGIRON", country: "UZ" },
  { src: "/images/clients/art-house.png", name: "ART HOUSE", country: "UZ" },
  { src: "/images/clients/avtotest7.jpg", name: "AVTOTEST7", country: "UZ" },
  { src: "/images/clients/donzar.png", name: "DONZAR", country: "UZ" },
  { src: "/images/clients/easy-tag.jpg", name: "EASY TAG", country: "GB" },
  { src: "/images/clients/enjen-digital.png", name: "ENJEN DIGITAL", country: "US" },
  { src: "/images/clients/enzopack.jpg", name: "ENZOPACK", country: "UZ" },
  { src: "/images/clients/global-exam.jpg", name: "GLOBAL EXAM", country: "UZ" },
  { src: "/images/clients/nbuild-group.png", name: "NBUILD GROUP", country: "UZ" },
  { src: "/images/clients/prava-on.png", name: "PRAVA-ON", country: "UZ" },
  { src: "/images/clients/refind-commerce.webp", name: "REFIND COMMERCE", country: "GB" },
  { src: "/images/clients/ria-marketing.png", name: "RIA MARKETING", country: "UZ" },
  { src: "/images/clients/salar.jpg", name: "SALAR", country: "UZ" },
  { src: "/images/clients/sargu-trans.jpg", name: "SARGU TRANS", country: "MD" },
  { src: "/images/clients/soro.png", name: "SORO", country: "UZ" },
];

export interface CountryPin {
  code: CountryCode;
  lat: number;
  lon: number;
}

// Pins sit on each country's main business hub. Order = the route the map
// camera flies on scroll: home first, then westward.
export const COUNTRY_PINS: CountryPin[] = [
  { code: "UZ", lat: 41.3, lon: 69.24 },
  { code: "MD", lat: 47.01, lon: 28.86 },
  { code: "GB", lat: 51.51, lon: -0.13 },
  { code: "US", lat: 39.5, lon: -98.35 },
];

export function clientsIn(code: CountryCode) {
  return CLIENTS.filter((c) => c.country === code);
}
