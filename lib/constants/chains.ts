// Chain name mapping for routing and display
export const CHAIN_NAME_MAP = {
  omniflix: 'omniflixhub',
  cosmos: 'cosmoshub',
  akash: 'akashnet',
  celestia: 'celestia',
  regen: 'regen',
  juno: 'juno',
  saga: 'saga',
  secret: 'secretnetwork',
  stargaze: 'stargaze',
  sentinel: 'sentinel',
  stride: 'stride',
  dydx: 'dydx',
  noble: 'noble',
  kujira: 'kujira',
  picasso: 'picasso',
  coreum: 'coreum',
} as const;

// Default enabled chains
export const DEFAULT_ENABLED_CHAINS = [
  'cosmoshub', // Required chain
  'osmosis', 
  'celestia',
  'akash',
  'juno',
];

// Supported chains configuration
export const SUPPORTED_CHAINS = {
  osmosis: {
    name: 'Osmosis',
    chainId: 'osmosis-1',
    denom: 'uosmo',
    symbol: 'OSMO',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png',
    rest: 'https://rest.cosmos.directory/osmosis',
    rpc: 'https://rpc.cosmos.directory/osmosis',
    gasPrice: '0.0025uosmo',
    gasMultiplier: 1.2,
    unbondingDays: 14
  },
  cosmoshub: {
    name: 'Cosmos Hub',
    chainId: 'cosmoshub-4',
    denom: 'uatom',
    symbol: 'ATOM',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png',
    rest: 'https://rest.cosmos.directory/cosmoshub',
    rpc: 'https://rpc.cosmos.directory/cosmoshub',
    gasPrice: '0.025uatom',
    gasMultiplier: 2.0,
    unbondingDays: 21,
    required: true, // Cosmos is required and cannot be disabled
  },
  akashnet: {
    name: 'Akash',
    chainId: 'akashnet-2',
    denom: 'uakt',
    symbol: 'AKT',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/akash/images/akt.png',
    rest: 'https://rest.cosmos.directory/akash',
    rpc: 'https://rpc.cosmos.directory/akash',
    gasPrice: '0.025uakt',
    gasMultiplier: 1.3,
    unbondingDays: 21,
  },
  celestia: {
    name: 'Celestia',
    chainId: 'celestia-1',
    denom: 'utia',
    symbol: 'TIA',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/celestia/images/celestia.png',
    rest: 'https://rest.cosmos.directory/celestia',
    rpc: 'https://rpc.cosmos.directory/celestia',
    gasPrice: '0.025utia',
    gasMultiplier: 1.3,
    unbondingDays: 14,
  },
  regen: {
    name: 'Regen',
    chainId: 'regen-1',
    denom: 'uregen',
    symbol: 'REGEN',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/regen/images/regen.png',
    rest: 'https://rest.cosmos.directory/regen',
    rpc: 'https://rpc.cosmos.directory/regen',
    gasPrice: '0.025uregen',
    gasMultiplier: 1.3,
    unbondingDays: 21,
  },
  juno: {
    name: 'Juno',
    chainId: 'juno-1',
    denom: 'ujuno',
    symbol: 'JUNO',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png',
    rest: 'https://rest.cosmos.directory/juno',
    rpc: 'https://rpc.cosmos.directory/juno',
    gasPrice: '0.025ujuno',
    gasMultiplier: 1.3,
    unbondingDays: 28,
  },
  omniflixhub: {
    name: 'OmniFlix',
    chainId: 'omniflixhub-1',
    denom: 'uflix',
    symbol: 'FLIX',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/omniflixhub/images/flix.png',
    rest: 'https://rest.cosmos.directory/omniflixhub',
    rpc: 'https://rpc.cosmos.directory/omniflixhub',
    gasPrice: '0.025uflix',
    gasMultiplier: 1.3,
    unbondingDays: 21,
  },
  secretnetwork: {
    name: 'Secret Network',
    chainId: 'secret-4',
    denom: 'uscrt',
    symbol: 'SCRT',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/secretnetwork/images/scrt.png',
    rest: 'https://rest.cosmos.directory/secretnetwork',
    rpc: 'https://rpc.cosmos.directory/secretnetwork',
    gasPrice: '0.025uscrt',
    gasMultiplier: 1.3,
    unbondingDays: 21,
  },
  stargaze: {
    name: 'Stargaze',
    chainId: 'stargaze-1',
    denom: 'ustars',
    symbol: 'STARS',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stargaze/images/stars.png',
    rest: 'https://rest.cosmos.directory/stargaze',
    rpc: 'https://rpc.cosmos.directory/stargaze',
    gasPrice: '0.025ustars',
    gasMultiplier: 1.3,
    unbondingDays: 14,
  },
  noble: {
    name: 'Noble',
    chainId: 'noble-1',
    denom: 'ustake',
    symbol: 'STAKE',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/noble/images/stake.png',
    rest: 'https://rest.cosmos.directory/noble',
    rpc: 'https://rpc.cosmos.directory/noble',
    gasPrice: '0.025ustake',
    gasMultiplier: 1.3,
    unbondingDays: 21,
  },
  kujira: {
    name: 'Kujira',
    chainId: 'kaiyo-1',
    denom: 'ukuji',
    symbol: 'KUJI',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/kujira/images/kuji.png',
    rest: 'https://rest.cosmos.directory/kujira',
    rpc: 'https://rpc.cosmos.directory/kujira',
    gasPrice: '0.025ukuji',
    gasMultiplier: 1.3,
    unbondingDays: 14,
  },
  coreum: {
    name: 'Coreum',
    chainId: 'coreum-mainnet-1',
    denom: 'ucore',
    symbol: 'CORE',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/coreum/images/coreum.png',
    rest: 'https://rest.cosmos.directory/coreum',
    rpc: 'https://rpc.cosmos.directory/coreum',
    gasPrice: '0.025ucore',
    gasMultiplier: 1.3,
    unbondingDays: 14,
  },
} as const;

// Types
export type ChainName = keyof typeof SUPPORTED_CHAINS;
export type ChainConfig = (typeof SUPPORTED_CHAINS)[ChainName];
export type ChainPath = keyof typeof CHAIN_NAME_MAP;

// Helper functions
export function getInternalChainName(path: string): string {
  return CHAIN_NAME_MAP[path as keyof typeof CHAIN_NAME_MAP] || path;
}

export function getChainConfig(chainName: string) {
  const internalName = getInternalChainName(chainName);
  const config =
    SUPPORTED_CHAINS[internalName as keyof typeof SUPPORTED_CHAINS];
  if (!config) {
    throw new Error(`Unsupported chain: ${chainName}`);
  }
  return config;
}
