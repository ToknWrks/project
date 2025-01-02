import { CHAIN_NAME_MAP } from '@/lib/constants/chains';

/**
 * Map of URL paths to internal chain names
 */
const PATH_TO_CHAIN_MAP = {
  'omniflix': 'omniflixhub',
  'cosmos': 'cosmoshub',
  'akash': 'akashnet',
  'secret': 'secretnetwork'
} as const;

/**
 * Get chain route for navigation
 */
export function getChainRoute(chainName: string): string {
  return chainName === 'osmosis' ? '/' : `/${getChainPath(chainName)}`;
}

/**
 * Convert chain name to URL path
 */
export function getChainPath(chainName: string): string {
  // Find the mapping entry where the value matches the chain name
  const entry = Object.entries(PATH_TO_CHAIN_MAP).find(([_, value]) => value === chainName);
  if (entry) {
    return entry[0];
  }
  return chainName;
}

/**
 * Get internal chain name from path/external name
 */
export function getInternalChainName(path: string): string {
  return PATH_TO_CHAIN_MAP[path as keyof typeof PATH_TO_CHAIN_MAP] || path;
}