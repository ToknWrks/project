import { useState, useCallback } from 'react';
import { fetchTokenPrice } from '@/lib/api/services/prices';
import { logError } from '@/lib/error-handling';

export function useTokenPrice(chainName: string = 'osmosis') {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatUsdValue = useCallback(async (amount: string | number): Promise<string> => {
    if (!amount) return '$0.00';
    
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) return '$0.00';

    try {
      setIsLoading(true);
      setError(null);
      const price = await fetchTokenPrice(chainName);
      return `$${(numericAmount * price).toFixed(2)}`;
    } catch (err) {
      const message = logError(err, 'Error formatting USD value', true);
      setError(message);
      return '$0.00';
    } finally {
      setIsLoading(false);
    }
  }, [chainName]);

  return {
    formatUsdValue,
    fetchPrice: fetchTokenPrice,
    isLoading,
    error
  };
}