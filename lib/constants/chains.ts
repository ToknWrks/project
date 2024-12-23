export const SUPPORTED_CHAINS = {
  'osmosis': {
    name: 'Osmosis',
    chainId: 'osmosis-1',
    denom: 'uosmo',
    symbol: 'OSMO',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png',
    rest: 'https://rest.cosmos.directory/osmosis',
    rpc: 'https://rpc.cosmos.directory/osmosis',
    unbondingDays: 14
  },
  'cosmoshub': {
    name: 'Cosmos Hub',
    chainId: 'cosmoshub-4',
    denom: 'uatom',
    symbol: 'ATOM',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png',
    rest: 'https://rest.cosmos.directory/cosmoshub',
    rpc: 'https://rpc.cosmos.directory/cosmoshub',
    unbondingDays: 21
  },
  'noble': {
    name: 'Noble',
    chainId: 'noble-1',
    denom: 'uusdc',
    symbol: 'USDC',
    decimals: 6,
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/noble/images/usdc.svg',
    rest: 'https://rest.cosmos.directory/noble',
    rpc: 'https://rpc.cosmos.directory/noble'
  },
  // ... other chains remain unchanged
} as const;

// Chain name mapping for routing
export const CHAIN_NAME_MAP = {
  'omniflix': 'omniflixhub',
  'cosmos': 'cosmoshub'
} as const;

// Helper to get chain info
export function getChainInfo(chainName: keyof typeof SUPPORTED_CHAINS) {
  return SUPPORTED_CHAINS[chainName];
}

// Helper to get internal chain name
export function getInternalChainName(path: string) {
  return CHAIN_NAME_MAP[path as keyof typeof CHAIN_NAME_MAP] || path;
}