// Map UI/URL paths to internal chain names
export const PATH_TO_CHAIN_MAP = {
  'omniflix': 'omniflixhub',
  'cosmos': 'cosmoshub',
  'akash': 'akashnet'
} as const;

// Map chain names to Coingecko IDs
export const CHAIN_TO_COINGECKO_ID = {
  'osmosis': 'osmosis',
  'cosmoshub': 'cosmos',
  'akashnet': 'akash-network',
  'celestia': 'celestia', 
  'regen': 'regen',
  'juno': 'juno-network',
  'dydx': 'dydx',
  'saga': 'saga-2',
  'omniflixhub': 'omniflix-network'
} as const;

// Helper to get internal chain name
export function getInternalChainName(path: string): string {
  return PATH_TO_CHAIN_MAP[path as keyof typeof PATH_TO_CHAIN_MAP] || path;
}

// Helper to get Coingecko ID
export function getCoingeckoId(chainName: string): string | undefined {
  const internalName = getInternalChainName(chainName);
  return CHAIN_TO_COINGECKO_ID[internalName as keyof typeof CHAIN_TO_COINGECKO_ID];
}

// Types
export type ChainPath = keyof typeof PATH_TO_CHAIN_MAP;
export type InternalChainName = typeof PATH_TO_CHAIN_MAP[ChainPath];