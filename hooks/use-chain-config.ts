import { getChainConfig } from '@/lib/utils/chain';

export function useChainConfig(chainName: string) {
  const chain = getChainConfig(chainName);
  
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainName}`);
  }

  return chain;
}