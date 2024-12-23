import { useState, useCallback } from 'react';
import { fetchTokenPrice } from '@/lib/api/services/prices';
import { logError } from '@/lib/error-handling';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PRICE_CACHE = new Map<string, { price: number; timestamp: number }>();

export function useTokenPrice(chainName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCachedPrice = useCallback((chainId: string) => {
    const cached = PRICE_CACHE.get(chainId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.price;
    }
    return null;
  }, []);

  const fetchPrice = useCallback(async (chainId: string): Promise<number> => {
    const cachedPrice = getCachedPrice(chainId);
    if (cachedPrice !== null) {
      return cachedPrice;
    }

    setIsLoading(true);
    setError(null);

    try {
      const price = await fetchTokenPrice(chainId);
      
      // Cache the result
      PRICE_CACHE.set(chainId, {
        price,
        timestamp: Date.now()
      });

      return price;
    } catch (err) {
      const message = logError(err, `Failed to fetch ${chainId} price`);
      setError(message);
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [getCachedPrice]);

  const formatUsdValue = useCallback(async (amount: string | number): Promise<string> => {
    if (!amount) return '$0.00';
    
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) return '$0.00';

    try {
      const price = await fetchPrice(chainName);
      return `$${(numericAmount * price).toFixed(2)}`;
    } catch (err) {
      logError(err, 'Error formatting USD value', true);
      return '$0.00';
    }
  }, [chainName, fetchPrice]);

  return {
    fetchPrice,
    formatUsdValue,
    isLoading,
    error
  };
}