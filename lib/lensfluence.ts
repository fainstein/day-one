/**
 * LensFluence - Mathematical logic for token price calculations
 *
 * This module contains the core mathematical functions for the LensFluence system,
 * which calculates token prices based on social metrics (Lens followers).
 */

export interface Artist {
  name: string;
  currentFollowers: number;
  previousFollowers: number;
  supply: number;
  previousRawValue: number;
}

export interface CalculationResult {
  artist: string;
  si: number;
  rawValue: number;
  requiredUSDC: number;
  finalPrice: number;
}

// Concepts
// - Success Index (SI): How much more successful the artist is now compared to before
// - Raw Value: Note: This is not the price of the artist, but a value derived from the success index
// - Required USDC: The amount of USDC required to buy the artist's token
// - Scaling Factor: The factor by which the raw value is scaled down to get the final price
// - Final Price: The price of the artist's token

/**
 * Calculate Success Index (SI) based on current and previous followers
 * SI = Current Followers / Previous Followers
 */
export function calculateSI(
  currentFollowers: number,
  previousFollowers: number
): number {
  // If previous followers is 0, return 1 to avoid division by zero
  return previousFollowers <= 0 ? 1 : currentFollowers / previousFollowers;
}

/**
 * Calculate Raw Value based on previous raw value and success index
 * Raw Value = Previous Raw Value * SI
 */
export function calculateRawValue(
  previousRawValue: number,
  si: number
): number {
  return previousRawValue * si;
}

/**
 * Calculate Required USDC based on raw value and token supply
 * Required USDC = Raw Value * Supply
 */
export function calculateRequiredUSDC(
  rawValue: number,
  supply: number
): number {
  return rawValue * supply;
}

/**
 * Calculate Scaling Factor based on treasury and total required USDC
 * Scaling Factor = min(1, Treasury / Total Required USDC)
 */
export function calculateScalingFactor(
  treasury: number,
  totalRequiredUSDC: number
): number {
  // If total required USDC is 0, return 1 to avoid division by zero
  if (totalRequiredUSDC <= 0) return 1;
  return Math.min(1, treasury / totalRequiredUSDC);
}

/**
 * Calculate Final Price based on raw value and scaling factor
 * Final Price = Raw Value * Scaling Factor
 */
export function calculateFinalPrice(
  rawValue: number,
  scalingFactor: number
): number {
  return rawValue * scalingFactor;
}

/**
 * Main calculation function for the LensFluence system
 * Processes all artists and returns the complete calculation results
 */
export function calculateLensFluence(
  artists: Artist[],
  treasury: number
): {
  results: CalculationResult[];
  totalRequiredUSDC: number;
  scalingFactor: number;
  totalPaid: number;
} {
  // Calculate SI, Raw Value, and Required USDC for each artist
  const preliminaryResults = artists.map((artist) => {
    const si = calculateSI(artist.currentFollowers, artist.previousFollowers);
    const rawValue = calculateRawValue(artist.previousRawValue, si);
    const requiredUSDC = calculateRequiredUSDC(rawValue, artist.supply);

    return {
      artist: artist.name,
      si,
      rawValue,
      requiredUSDC,
      supply: artist.supply,
    };
  });

  // Calculate total required USDC
  const totalRequiredUSDC = preliminaryResults.reduce(
    (sum, result) => sum + result.requiredUSDC,
    0
  );

  // Calculate scaling factor
  const scalingFactor = calculateScalingFactor(treasury, totalRequiredUSDC);

  // Calculate final prices and total paid
  const results = preliminaryResults.map((result) => {
    const finalPrice = calculateFinalPrice(result.rawValue, scalingFactor);
    return {
      artist: result.artist,
      si: result.si,
      rawValue: result.rawValue,
      requiredUSDC: result.requiredUSDC,
      finalPrice,
    };
  });

  // Calculate total paid
  const totalPaid = results.reduce(
    (sum, result, index) => sum + result.finalPrice * artists[index].supply,
    0
  );

  return {
    results,
    totalRequiredUSDC,
    scalingFactor,
    totalPaid,
  };
}
