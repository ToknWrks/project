// Chain name mapping for routing and display
export const CHAIN_NAME_MAP = {
  'omniflix': 'omniflixhub',
  'cosmos': 'cosmoshub',
  'akash': 'akashnet',
  'celestia': 'celestia',
  'regen': 'regen',
  'juno': 'juno',
  'saga': 'saga',
  'stargaze': 'stargaze',
  'sentinel': 'sentinel',
  'stride': 'stride',
  'dydx': 'dydx',
  'noble': 'noble',
  'coreum': 'coreum'
} as const;

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
    unbondingDays: 14
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
    unbondingDays: 21
  },
  akashnet: {
    name: "Akash",
    chainId: "akashnet-2",
    denom: "uakt",
    symbol: "AKT",
    decimals: 6,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/akash/images/akt.png",
    rest: "https://rest.cosmos.directory/akash",
    rpc: "https://rpc.cosmos.directory/akash",
    unbondingDays: 21
  },
  celestia: {
    name: "Celestia",
    chainId: "celestia-1",
    denom: "utia",
    symbol: "TIA",
    decimals: 6,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/celestia/images/celestia.png",
    rest: "https://rest.cosmos.directory/celestia",
    rpc: "https://rpc.cosmos.directory/celestia",
    unbondingDays: 14
  },
  regen: {
    name: "Regen",
    chainId: "regen-1",
    denom: "uregen",
    symbol: "REGEN",
    decimals: 6,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/regen/images/regen.png",
    rest: "https://rest.cosmos.directory/regen",
    rpc: "https://rpc.cosmos.directory/regen",
    unbondingDays: 21
  },
  juno: {
    name: "Juno",
    chainId: "juno-1",
    denom: "ujuno",
    symbol: "JUNO",
    decimals: 6,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png",
    rest: "https://rest.cosmos.directory/juno",
    rpc: "https://rpc.cosmos.directory/juno",
    unbondingDays: 28
  },
  saga: {
    name: "Saga",
    chainId: "saga-1",
    denom: "usaga",
    symbol: "SAGA",
    decimals: 6,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/saga/images/saga.png",
    rest: "https://rest.cosmos.directory/saga",
    rpc: "https://rpc.cosmos.directory/saga",
    unbondingDays: 14
  },
  stargaze: {
    name: "Stargaze",
    chainId: "stargaze-1",
    denom: "ustars",
    symbol: "STARS",
    decimals: 6,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/stargaze/images/stars.png",
    rest: "https://rest.cosmos.directory/stargaze",
    rpc: "https://rpc.cosmos.directory/stargaze",
    unbondingDays: 14
  },
  sentinel: {
    name: "Sentinel",
    chainId: "sentinelhub-2",
    denom: "udvpn",
    symbol: "DVPN",
    decimals: 6,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/sentinel/images/dvpn.png",
    rest: "https://rest.cosmos.directory/sentinel",
    rpc: "https://rpc.cosmos.directory/sentinel",
    unbondingDays: 21
  },
  stride: {
    name: "Stride",
    chainId: "stride-1",
    denom: "ustrd",
    symbol: "STRD",
    decimals: 6,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/strd.png",
    rest: "https://rest.cosmos.directory/stride",
    rpc: "https://rpc.cosmos.directory/stride",
    unbondingDays: 14
  },
  dydx: {
    name: "dYdX",
    chainId: "dydx-mainnet-1",
    denom: "adydx",
    symbol: "DYDX",
    decimals: 18,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/dydx/images/dydx.png",
    rest: "https://rest.cosmos.directory/dydx",
    rpc: "https://rpc.cosmos.directory/dydx",
    unbondingDays: 14
  },
  omniflixhub: {
    name: "OmniFlix",
    chainId: "omniflixhub-1",
    denom: "uflix",
    symbol: "FLIX",
    decimals: 6,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/omniflixhub/images/flix.png",
    rest: "https://rest.cosmos.directory/omniflixhub",
    rpc: "https://rpc.cosmos.directory/omniflixhub",
    unbondingDays: 14
  },
  noble: {
    name: "Noble",
    chainId: "noble-1",
    denom: "unble",
    symbol: "NOBLE",
    decimals: 6,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/noble/images/noble.png",
    rest: "https://rest.cosmos.directory/noble",
    rpc: "https://rpc.cosmos.directory/noble",
    unbondingDays: 14
  },
  coreum: {
    name: "Coreum",
    chainId: "coreum-mainnet-1",
    denom: "ucore",
    symbol: "CORE",
    decimals: 6,
    icon: "https://raw.githubusercontent.com/cosmos/chain-registry/master/coreum/images/coreum.png",
    rest: "https://rest.mainnet-1.coreum.dev",
    rpc: "https://rpc.mainnet-1.coreum.dev",
    unbondingDays: 14
  }
} as const;

// Helper to get internal chain name
export function getInternalChainName(path: string): string {
  return CHAIN_NAME_MAP[path as keyof typeof CHAIN_NAME_MAP] || path;
}

// Helper to get chain config
export function getChainConfig(chainName: string) {
  const internalName = getInternalChainName(chainName);
  return SUPPORTED_CHAINS[internalName as keyof typeof SUPPORTED_CHAINS];
}

// Types
export type ChainName = keyof typeof SUPPORTED_CHAINS;
export type ChainConfig = typeof SUPPORTED_CHAINS[ChainName];