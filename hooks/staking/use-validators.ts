import { useState, useEffect } from 'react';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { logError } from '@/lib/error-handling';
import { retryFetch } from '@/lib/utils/fetch';

export interface Validator {
  address: string;
  name: string;
  description?: string;
  website?: string;
  commission: string;
  tokens: string;
  status: string;
}

export function useValidators(chainName: string) {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchValidators() {
      const chain = SUPPORTED_CHAINS[chainName as keyof typeof SUPPORTED_CHAINS];
      if (!chain) {
        setError(`Unsupported chain: ${chainName}`);
        return;
      }

      try {
        const response = await retryFetch(
          `${chain.rest}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED`
        );
        const data = await response.json();

        if (!Array.isArray(data?.validators)) {
          throw new Error('Invalid validator data received');
        }

        const activeValidators = data.validators
          .filter((v: any) => v.status === 'BOND_STATUS_BONDED')
          .map((v: any) => ({
            address: v.operator_address,
            name: v.description.moniker,
            description: v.description.details,
            website: v.description.website,
            commission: v.commission.commission_rates.rate,
            tokens: v.tokens,
            status: v.status
          }))
          .sort((a, b) => Number(b.tokens) - Number(a.tokens));

        setValidators(activeValidators);
        setError(null);
      } catch (err) {
        const message = logError(err, `Failed to fetch ${chainName} validators`);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchValidators();
  }, [chainName]);

  return {
    validators,
    isLoading,
    error
  };
}