import { retryFetch } from '@/lib/utils/fetch';
import { logError } from '@/lib/error-handling';

export interface Validator {
  name: string;
  commission: string;
  description?: string;
  website?: string;
  identity?: string;
  address: string;
}

export interface Delegation {
  validator: Validator;
  amount: string;
  rewards: string;
}

export async function fetchValidatorInfo(
  restUrl: string,
  validatorAddress: string
): Promise<Validator | null> {
  try {
    const response = await retryFetch(
      `${restUrl}/cosmos/staking/v1beta1/validators/${validatorAddress}`
    );
    const data = await response.json();
    
    if (!data.validator) {
      throw new Error('Validator not found');
    }

    return {
      name: data.validator.description.moniker,
      commission: data.validator.commission.commission_rates.rate,
      description: data.validator.description.details,
      website: data.validator.description.website,
      identity: data.validator.description.identity,
      address: validatorAddress
    };
  } catch (err) {
    logError(err, `Failed to fetch validator info for ${validatorAddress}`, true);
    return null;
  }
}

export async function fetchDelegations(
  restUrl: string,
  address: string,
  decimals: number = 6
): Promise<{
  delegations: Delegation[];
  total: string;
}> {
  try {
    const response = await retryFetch(
      `${restUrl}/cosmos/staking/v1beta1/delegations/${address}`
    );
    const data = await response.json();

    if (!Array.isArray(data?.delegation_responses)) {
      throw new Error('Invalid delegation data received');
    }

    const delegations = await Promise.all(
      data.delegation_responses.map(async (del: any) => {
        const validatorInfo = await fetchValidatorInfo(
          restUrl,
          del.delegation.validator_address
        );

        return {
          validator: validatorInfo || {
            name: "Unknown Validator",
            commission: "0",
            address: del.delegation.validator_address
          },
          amount: (Number(del.balance.amount) / Math.pow(10, decimals)).toFixed(decimals),
          rewards: "0" // Rewards fetched separately
        };
      })
    );

    const total = delegations.reduce(
      (sum, del) => sum + Number(del.amount),
      0
    ).toFixed(decimals);

    return { delegations, total };
  } catch (err) {
    logError(err, 'Fetching delegations', true);
    return { delegations: [], total: "0" };
  }
}