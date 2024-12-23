import { useState, useCallback } from 'react';
import { Delegation, fetchDelegations } from '@/lib/api/services/delegations';
import { logError } from '@/lib/error-handling';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';

export function useChainDelegations(chainName: string) {
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [totalStaked, setTotalStaked] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChainDelegations = useCallback(async (address: string) => {
    if (!address) return;

    const chain = SUPPORTED_CHAINS[chainName as keyof typeof SUPPORTED_CHAINS];
    if (!chain) {
      setError(`Unsupported chain: ${chainName}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { delegations, total } = await fetchDelegations(
        chain.rest,
        address,
        chain.decimals
      );

      setDelegations(delegations);
      setTotalStaked(total);
    } catch (err) {
      const message = logError(err, `Failed to fetch ${chainName} delegations`);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [chainName]);

  return {
    delegations,
    totalStaked,
    isLoading,
    error,
    fetchDelegations: fetchChainDelegations
  };
}