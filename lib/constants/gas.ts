// Default gas settings for different transaction types
export const GAS_LIMITS = {
  DELEGATE: 300000,
  UNDELEGATE: 300000, 
  REDELEGATE: 350000,
  CLAIM_REWARDS: 250000,
  TRANSFER: 100000
} as const;

// Gas prices per chain (in smallest denomination)
export const GAS_PRICES = {
  osmosis: '0.025uosmo',
  cosmoshub: '0.025uatom',
  akash: '0.025uakt',
  juno: '0.025ujuno',
  regen: '0.025uregen'
} as const;

// Helper to get gas price for a chain
export function getGasPrice(chainName: string): string {
  return GAS_PRICES[chainName as keyof typeof GAS_PRICES] || '0.025';
}