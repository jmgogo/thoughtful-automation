import { z } from "zod";

const THRESHOLDS = {
  VOLUME: 1000000, // cm³
  DIMENSION: 150, // cm
  MASS: 20, // kg
} as const;

// Assume inputs can be provided as either strings or numbers
const packageInputSchema = z.object({
  width: z.coerce.number().gt(0),
  height: z.coerce.number().gt(0),
  length: z.coerce.number().gt(0),
  mass: z.coerce.number().gt(0),
});

/**
 * Stack types for package dispatch
 */
export type StackType = "STANDARD" | "SPECIAL" | "REJECTED";

/**
 * Sorts packages into appropriate stacks based on their dimensions and mass.
 *
 * @param width - Width in centimeters
 * @param height - Height in centimeters
 * @param length - Length in centimeters
 * @param mass - Mass in kilograms
 * @returns Stack name: "STANDARD", "SPECIAL", or "REJECTED"
 * @throws {Error} If any parameter is invalid
 */
export function sort(
  widthIn: unknown,
  heightIn: unknown,
  lengthIn: unknown,
  massIn: unknown,
): StackType | Error {
  // Parse and validate inputs with Zod
  const { width, height, length, mass } = packageInputSchema.parse({
    width: widthIn,
    height: heightIn,
    length: lengthIn,
    mass: massIn,
  });

  const isBulky = checkIfBulky(width, height, length);
  const isHeavy = checkIfHeavy(mass);

  // Dispatch logic
  if (isBulky && isHeavy) {
    return "REJECTED";
  } else if (isBulky || isHeavy) {
    return "SPECIAL";
  } else {
    return "STANDARD";
  }
}

/**
 * Determines if a package is bulky based on volume or dimensions.
 *
 * A package is bulky if:
 * - Its volume is >= 1,000,000 cm³, OR
 * - Any dimension is >= 150 cm
 *
 * @param width - Width in centimeters
 * @param height - Height in centimeters
 * @param length - Length in centimeters
 * @returns True if the package is bulky
 */
export function checkIfBulky(
  width: number,
  height: number,
  length: number,
): boolean {
  const volume = width * height * length;

  return (
    volume >= THRESHOLDS.VOLUME ||
    width >= THRESHOLDS.DIMENSION ||
    height >= THRESHOLDS.DIMENSION ||
    length >= THRESHOLDS.DIMENSION
  );
}

/**
 * Determines if a package is heavy based on its mass.
 *
 * A package is heavy if its mass is >= 20 kg
 *
 * @param mass - Mass in kilograms
 * @returns True if the package is heavy
 */
export function checkIfHeavy(mass: number): boolean {
  return mass >= THRESHOLDS.MASS;
}
