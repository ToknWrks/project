import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { getChainPath } from './chain-routing';

/**
 * Get enabled networks for navigation
 */
export function getEnabledNetworks(enabledChains: Set<string>) {
  return Object.entries(SUPPORTED_CHAINS)
    .filter(([chainName]) => enabledChains.has(chainName))
    .map(([chainName, chain]) => {
      // Get the correct URL path
      const path = getChainPath(chainName);
      const href = chainName === 'cosmoshub' ? '/' : `/${path}`;

      return {
        name: chain.name,
        href,
        icon: chain.icon,
        chainId: chain.chainId,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get chain URL for navigation
 */
export function getChainUrl(chainName: string): string {
  return chainName === 'cosmoshub' ? '/' : `/${getChainPath(chainName)}`;
}
