// Map chain names to Coingecko IDs
export const CHAIN_TO_COINGECKO_ID: { [key: string]: string } = {
  'osmosis': 'osmosis',
  'cosmoshub': 'cosmos',
  'celestia': 'celestia',
  'akashnet': 'akash-network',
  'regen': 'regen',
  'juno': 'juno-network',
  'dydx': 'dydx',
  'saga': 'saga-2',
  'omniflixhub': 'omniflix-network',
  'stargaze': 'stargaze',
  'stride': 'stride',
  'sentinel': 'sentinel',
  'archway': 'archway',
  'noble': 'noble',
  'persistence': 'persistence',
  'evmos': 'evmos',
  'injective': 'injective-protocol',
  'secretnetwork': 'secret',
  'terra': 'terra-luna-2',
  'kujira': 'kujira',
  'coreum': 'coreum'
} as const;

// Fallback prices when API fails
export const FALLBACK_PRICES: Record<string, number> = {
  'osmosis': 0.55,
  'cosmoshub': 7.50,
  'akashnet': 0.95,
  'celestia': 6.20,
  'regen': 0.07,
  'juno': 0.45,
  'coreum': 0.85,
  'kujira': 1.85,
  'noble': 1.00
};