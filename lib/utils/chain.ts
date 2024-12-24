import { FALLBACK_ENDPOINTS } from '@/lib/constants/endpoints';
import { getChainFromRegistry, getSecureEndpoints } from './chain-registry';

export function getChainEndpoints(chainName: string) {
  // First try fallback endpoints
  const fallback = FALLBACK_ENDPOINTS[chainName];
  if (fallback) {
    return fallback;
  }

  // Get chain from registry
  const chain = getChainFromRegistry(chainName);
  if (!chain) return null;

  // Get secure endpoints
  return getSecureEndpoints(chain);
}