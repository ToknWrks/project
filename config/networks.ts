import { SUPPORTED_CHAINS, getChainConfig } from '@/lib/constants/chains';

// Create networks array for navigation
export const NETWORKS = Object.entries(SUPPORTED_CHAINS).map(([key, chain]) => ({
  name: chain.name,
  href: key === 'osmosis' ? '/' : `/${key}`,
  icon: chain.icon,
  chainId: chain.chainId
}));

// Helper to get network path
export function getNetworkPath(chainName: string): string {
  const chain = getChainConfig(chainName);
  if (!chain) return '/';
  
  const key = chain.chainId.split('-')[0];
  return key === 'osmosis' ? '/' : `/${key}`;
}

// Helper to get network icon
export function getNetworkIcon(chainName: string): string | undefined {
  const chain = getChainConfig(chainName);
  return chain?.icon;
}