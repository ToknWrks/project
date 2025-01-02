import { CHAIN_NAME_MAP, SUPPORTED_CHAINS, getInternalChainName } from '@/lib/constants/chains';

/**
 * Convert a URL path/external chain name to internal chain name
 */
export function getChainName(path: string): string {
  return getInternalChainName(path);
}

/**
 * Get chain URL for navigation
 */
export function getChainUrl(chainName: string): string {
  const internalName = getInternalChainName(chainName);
  return internalName === 'osmosis' ? '/' : `/${chainName}`;
}

/**
 * Get chain configuration
 */
export function getChainConfig(chainName: string) {
  const internalName = getInternalChainName(chainName);
  const config = SUPPORTED_CHAINS[internalName as keyof typeof SUPPORTED_CHAINS];
  
  if (!config) {
    throw new Error(`Unsupported chain: ${chainName}`);
  }
  
  return config;
}