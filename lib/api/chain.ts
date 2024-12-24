import { logError } from '@/lib/error-handling';
import { retryFetch } from '@/lib/utils/fetch';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';

// Validate API response
async function validateResponse(response: Response, context: string) {
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    throw new Error(`Invalid response type from ${context}: expected JSON, got ${contentType}`);
  }

  const data = await response.json();
  if (!data) {
    throw new Error(`Empty response from ${context}`);
  }

  return data;
}

// Fetch chain balance
export async function fetchChainBalance(
  restUrl: string,
  address: string,
  denom: string,
  decimals: number = 6
): Promise<string> {
  try {
    const response = await retryFetch(
      `${restUrl}/cosmos/bank/v1beta1/balances/${address}`
    );
    
    const data = await validateResponse(response, 'balance endpoint');
    
    if (!Array.isArray(data?.balances)) {
      throw new Error('Invalid balance data format');
    }

    const balance = data.balances.find((b: any) => b.denom === denom);
    return balance ? (Number(balance.amount) / Math.pow(10, decimals)).toFixed(decimals) : "0";
  } catch (err) {
    logError(err, 'Fetching balance', true);
    return "0";
  }
}

// Fetch chain delegations
export async function fetchChainDelegations(
  restUrl: string,
  address: string,
  decimals: number = 6
) {
  try {
    const response = await retryFetch(
      `${restUrl}/cosmos/staking/v1beta1/delegations/${address}`
    );
    
    const data = await validateResponse(response, 'delegations endpoint');

    if (!Array.isArray(data?.delegation_responses)) {
      throw new Error('Invalid delegation data format');
    }

    // Get validator info for each delegation
    const delegationsWithInfo = await Promise.all(
      data.delegation_responses.map(async (delegation: any) => {
        try {
          const validatorInfo = await fetchValidatorInfo(
            restUrl,
            delegation.delegation.validator_address
          );

          return {
            ...delegation,
            validator: validatorInfo ? {
              ...validatorInfo,
              address: delegation.delegation.validator_address
            } : {
              name: "Unknown Validator",
              commission: "0",
              address: delegation.delegation.validator_address
            }
          };
        } catch (err) {
          logError(err, 'Processing delegation', true);
          return delegation;
        }
      })
    );

    const totalStaked = delegationsWithInfo.reduce(
      (sum: number, del: any) => sum + (Number(del.balance.amount) / Math.pow(10, decimals)),
      0
    );

    return {
      delegations: delegationsWithInfo,
      stakedBalance: totalStaked.toFixed(decimals)
    };
  } catch (err) {
    logError(err, 'Fetching delegations', true);
    return {
      delegations: [],
      stakedBalance: "0"
    };
  }
}

// Fetch chain rewards
export async function fetchChainRewards(
  restUrl: string,
  address: string,
  denom: string,
  decimals: number = 6
): Promise<string> {
  try {
    const response = await retryFetch(
      `${restUrl}/cosmos/distribution/v1beta1/delegators/${address}/rewards`
    );
    
    const data = await validateResponse(response, 'rewards endpoint');

    if (!Array.isArray(data?.total)) {
      throw new Error('Invalid rewards data format');
    }

    const rewards = data.total.find((r: any) => r.denom === denom);
    return rewards ? (Number(rewards.amount) / Math.pow(10, decimals)).toFixed(decimals) : "0";
  } catch (err) {
    logError(err, 'Fetching rewards', true);
    return "0";
  }
}

// Fetch validator info
async function fetchValidatorInfo(restUrl: string, validatorAddress: string) {
  try {
    const response = await retryFetch(
      `${restUrl}/cosmos/staking/v1beta1/validators/${validatorAddress}`
    );
    
    const data = await validateResponse(response, 'validator endpoint');
    
    if (!data.validator) {
      throw new Error('Validator not found');
    }

    return {
      name: data.validator.description.moniker,
      commission: data.validator.commission.commission_rates.rate,
      description: data.validator.description.details,
      website: data.validator.description.website,
      identity: data.validator.description.identity
    };
  } catch (err) {
    logError(err, `Failed to fetch validator info for ${validatorAddress}`, true);
    return null;
  }
}