import { COUNTRY_PINS } from "@/lib/clients";

// Scroll progress (0..1 through the pinned map section) at which the camera
// arrives at each pin and its light column ignites. Indexed like COUNTRY_PINS.
export const PIN_ARRIVE = [0.14, 0.38, 0.58, 0.78];
// How long the camera lingers on a pin before flying on.
export const PIN_HOLD = 0.1;
// After this the camera pulls back to show the whole network at once.
export const SUMMARY_AT = 0.92;

/** -1 = intro, 0..n-1 = focused pin, n = summary */
export function stageAt(progress: number): number {
  if (progress >= SUMMARY_AT) return COUNTRY_PINS.length;
  let stage = -1;
  PIN_ARRIVE.forEach((at, i) => {
    if (progress >= at - 0.05) stage = i;
  });
  return stage;
}
