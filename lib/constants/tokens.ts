import { SUPPORTED_CHAINS } from './chains';

export interface Token {
  denom: string;
  symbol: string;
  name: string;
  logo?: string;
  decimals: number;
}

// Noble USDC token
export const NOBLE_USDC: Token = {
  denom: 'ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4',
  symbol: 'USDC',
  name: 'Noble USDC',
  decimals: 6,
  logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/noble/images/usdc.svg'
};

// Helper function to get token info for a chain
export function getChainToken(chainName: string): Token | undefined {
  const chain = SUPPORTED_CHAINS[chainName as keyof typeof SUPPORTED_CHAINS];
  if (!chain) return undefined;

  return {
    denom: chain.denom,
    symbol: chain.symbol,
    name: chain.name,
    decimals: chain.decimals,
    logo: chain.icon
  };
}