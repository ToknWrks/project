import { SUPPORTED_CHAINS } from './chains';

export interface Token {
  denom: string;
  symbol: string;
  name: string;
  logo?: string;
  decimals: number;
}

// Default Osmosis tokens
export const OSMOSIS_TOKENS: Token[] = [
  {
    denom: 'uosmo',
    symbol: 'OSMO',
    name: 'Osmosis',
    decimals: 6,
    logo: SUPPORTED_CHAINS.osmosis.icon
  },
  {
    denom: 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
    symbol: 'ATOM',
    name: 'Cosmos Hub ATOM',
    decimals: 6,
    logo: SUPPORTED_CHAINS.cosmoshub.icon
  }
];

// Noble USDC token
export const NOBLE_USDC: Token = {
  denom: 'ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4',
  symbol: 'USDC',
  name: 'Noble USDC',
  decimals: 6,
  logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/noble/images/usdc.svg'
};