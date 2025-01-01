import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { getInternalChainName } from '@/lib/utils/chain';

export function useChainConfig(chainName: string) {
  // Get internal chain name (e.g., convert 'akash' to 'akashnet')
  const internalName = getInternalChainName(chainName);
  const chain = SUPPORTED_CHAINS[internalName as keyof typeof SUPPORTED_CHAINS];
  
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainName}`);
  }

  return chain;
}