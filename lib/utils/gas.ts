import { SUPPORTED_CHAINS } from '@/lib/constants/chains';

// Base gas units for different operations
const BASE_GAS = {
  CLAIM_REWARDS: 140000,
  PER_VALIDATOR: 60000,
  BUFFER_MULTIPLIER: 1.4
};

/**
 * Calculate gas limit with chain-specific adjustments
 */
export function calculateGasLimit(params: {
  chainName: string;
  baseGas: number;
  validatorCount?: number;
}): number {
  const { chainName, baseGas, validatorCount = 1 } = params;
  
  // Get chain config
  const chain = SUPPORTED_CHAINS[chainName as keyof typeof SUPPORTED_CHAINS];
  if (!chain) return baseGas * BASE_GAS.BUFFER_MULTIPLIER;
  
  // Calculate total gas
  const totalGas = baseGas + (BASE_GAS.PER_VALIDATOR * validatorCount);
  
  // Apply chain multiplier and buffer
  return Math.ceil(totalGas * chain.gasMultiplier * BASE_GAS.BUFFER_MULTIPLIER);
}

/**
 * Get chain-specific gas price
 */
export function getGasPrice(chainName: string): string {
  const chain = SUPPORTED_CHAINS[chainName as keyof typeof SUPPORTED_CHAINS];
  return chain?.gasPrice || '0.025';
}

/**
 * Calculate claim rewards gas
 */
export function calculateClaimRewardsGas(chainName: string, validatorCount: number = 1): number {
  return calculateGasLimit({
    chainName,
    baseGas: BASE_GAS.CLAIM_REWARDS,
    validatorCount
  });
}