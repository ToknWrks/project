import { useState, useCallback } from 'react';
import { ChainBalance, fetchBalances } from '@/lib/api/services/balances';
import { useTokenPrice } from '../prices/use-token-price';
import { logError } from '@/lib/error-handling';

export function useChainBalances(chainName: string) {
  const [balances, setBalances] = useState<ChainBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchPrice } = useTokenPrice(chainName);

  const fetchChainBalances = useCallback(async (address: string) => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const chainBalances = await fetchBalances(address, chainName);
      
      // Get token price and calculate USD values
      const price = await fetchPrice(chainName);
      
      chainBalances.usdValues = {
        available: (Number(chainBalances.available) * price).toFixed(2),
        staked: (Number(chainBalances.staked) * price).toFixed(2),
        rewards: (Number(chainBalances.rewards) * price).toFixed(2),
        total: ((Number(chainBalances.available) + 
                Number(chainBalances.staked) + 
                Number(chainBalances.rewards)) * price).toFixed(2)
      };

      setBalances(chainBalances);
    } catch (err) {
      const message = logError(err, `Failed to fetch ${chainName} balances`);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [chainName, fetchPrice]);

  return {
    balances,
    isLoading,
    error,
    fetchBalances: fetchChainBalances
  };
}