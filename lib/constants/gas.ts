// Default gas settings for different transaction types
export const GAS_LIMITS = {
  DELEGATE: 300000,
  UNDELEGATE: 300000,
  REDELEGATE: 350000,
  CLAIM_REWARDS_BASE: 200000,      // Base gas for claiming rewards
  CLAIM_REWARDS_PER_VALIDATOR: 80000, // Gas per validator
  TRANSFER: 100000
} as const;

// Chain-specific gas multipliers
export const CHAIN_GAS_MULTIPLIERS: Record<string, number> = {
  'cosmoshub': 2.0,  // Doubled gas multiplier for Cosmos Hub
  'osmosis': 1.2,    // Standard multiplier for Osmosis
  'default': 1.3     // Default multiplier for other chains
};

// Gas buffer multiplier for safety margin
export const GAS_BUFFER = 1.5; // 50% buffer

// Chain-specific gas prices (in smallest denomination)
export const GAS_PRICES: Record<string, string> = {
  'osmosis': '0.0025uosmo',
  'cosmoshub': '0.025uatom',  // Higher gas price for Cosmos Hub
  'akash': '0.025uakt',
  'juno': '0.025ujuno',
  'regen': '0.025uregen',
  'celestia': '0.025utia',
  'dydx': '0.025adydx',
  'noble': '0.025ustake',
  'secretnetwork': '0.025uscrt',
  'stargaze': '0.025ustars',
  'stride': '0.025ustrd',
  'sentinel': '0.025udvpn'
};

/**
 * Calculate gas limit for claiming rewards
 */
export function calculateClaimRewardsGas(validatorCount: number): number {
  const baseGas = GAS_LIMITS.CLAIM_REWARDS_BASE;
  const validatorGas = GAS_LIMITS.CLAIM_REWARDS_PER_VALIDATOR * validatorCount;
  return Math.ceil((baseGas + validatorGas) * GAS_BUFFER);
}

/**
 * Get chain-specific gas price with fallback
 */
export function getGasPrice(chainName: string): string {
  return GAS_PRICES[chainName] || '0.025';
}

/**
 * Calculate chain-specific gas limit
 */
export function calculateChainGas(chainName: string, baseGas: number): number {
  const multiplier = CHAIN_GAS_MULTIPLIERS[chainName] || CHAIN_GAS_MULTIPLIERS.default;
  return Math.ceil(baseGas * multiplier * GAS_BUFFER);
}