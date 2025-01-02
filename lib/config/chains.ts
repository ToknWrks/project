// Chain name mapping for routing and display
export const CHAIN_NAME_MAP = {
  'omniflix': 'omniflixhub',
  'cosmos': 'cosmoshub',
  'akash': 'akashnet',
  'celestia': 'celestia',
  'regen': 'regen',
  'juno': 'juno',
  'saga': 'saga',
  'secret': 'secretnetwork',
  'stargaze': 'stargaze',
  'sentinel': 'sentinel',
  'stride': 'stride',
  'dydx': 'dydx',
  'noble': 'noble',
  'kujira': 'kujira',
  'coreum': 'coreum'
} as const;

// Default enabled chains
export const DEFAULT_ENABLED_CHAINS = [
  'osmosis',  // Required chain
  'cosmoshub',
  'celestia',
  'akash',
  'juno'
];

// Supported chains configuration
export const SUPPORTED_CHAINS = {
  osmosis: {
    name: "Osmosis",
    chainId: "osmosis-1",
    denom: "uosmo",
    symbol: "OSMO",
    decimals: 6,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png",
    rest: "https://rest.cosmos.directory/osmosis",
    rpc: "https://rpc.cosmos.directory/osmosis",
    gasPrice: "0.0025uosmo",
    gasMultiplier: 1.2,
    unbondingDays: 14,
    required: true // Osmosis is required and cannot be disabled
  },
  cosmoshub: {
    name: "Cosmos Hub",
    chainId: "cosmoshub-4", 
    denom: "uatom",
    symbol: "ATOM",
    decimals: 6,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png",
    rest: "https://rest.cosmos.directory/cosmoshub",
    rpc: "https://rpc.cosmos.directory/cosmoshub",
    gasPrice: "0.025uatom",
    gasMultiplier: 1.3,
    unbondingDays: 21
  },
  // Add other chains...
} as const;

// Types
export type ChainName = keyof typeof SUPPORTED_CHAINS;
export type ChainConfig = typeof SUPPORTED_CHAINS[ChainName];
export type ChainPath = keyof typeof CHAIN_NAME_MAP;

// Helper functions
export function getInternalChainName(path: string): string {
  return CHAIN_NAME_MAP[path as keyof typeof CHAIN_NAME_MAP] || path;
}

export function getChainConfig(chainName: string) {
  const internalName = getInternalChainName(chainName);
  const config = SUPPORTED_CHAINS[internalName as keyof typeof SUPPORTED_CHAINS];
  if (!config) {
    throw new Error(`Unsupported chain: ${chainName}`);
  }
  return config;
}

export function getChainPath(chainName: string): string {
  // Find the mapping entry where the value matches the chain name
  const entry = Object.entries(CHAIN_NAME_MAP).find(([_, value]) => value === chainName);
  return entry ? entry[0] : chainName;
}

export function getChainUrl(chainName: string): string {
  return chainName === 'osmosis' ? '/' : `/${getChainPath(chainName)}`;
}