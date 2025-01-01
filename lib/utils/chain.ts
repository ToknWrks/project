import { CHAIN_NAME_MAP } from '@/lib/constants/chains';

/**
 * Convert a URL path/external chain name to internal chain name
 */
export function getInternalChainName(path: string): string {
  return CHAIN_NAME_MAP[path as keyof typeof CHAIN_NAME_MAP] || path;
}

/**
 * Convert an internal chain name to URL path
 */
export function getChainPath(chainName: string): string {
  // Find the mapping entry where the value matches the chain name
  const entry = Object.entries(CHAIN_NAME_MAP).find(([_, value]) => value === chainName);
  if (entry) {
    return entry[0];
  }
  return chainName;
}

/**
 * Get chain URL for navigation
 */
export function getChainUrl(chainName: string): string {
  const path = getChainPath(chainName);
  return path === 'osmosis' ? '/' : `/${path}`;
}