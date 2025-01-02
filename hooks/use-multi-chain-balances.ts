import { useState, useEffect } from 'react';
import { useChainSettings } from './use-chain-settings';
import { useChainCache } from './use-chain-cache';
import { useTokenPrice } from './use-token-price';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { fetchChainBalances } from '@/lib/api/services/chain-balances';
import { logError } from '@/lib/error-handling';
import { getAddressForChain } from '@/lib/utils/address';

export function useMultiChainBalances(cosmosAddress?: string) {
  const [balances, setBalances] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingChains, setLoadingChains] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const { enabledChains } = useChainSettings();
  const { getBalances: getCachedBalances, setBalances: setCachedBalances } = useChainCache();
  const { fetchPrice } = useTokenPrice();

  useEffect(() => {
    const fetchBalances = async () => {
      if (!cosmosAddress) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      // Use cached balances initially
      const cachedBalances = getCachedBalances();
      if (Object.keys(cachedBalances).length > 0) {
        setBalances(cachedBalances);
      }

      const newBalances: Record<string, any> = {};
      const loadingChainsSet = new Set<string>();

      try {
        // Get list of enabled chains
        const enabledChainsList = Array.from(enabledChains)
          .filter(chainName => chainName in SUPPORTED_CHAINS);

        // Fetch data for each chain in parallel
        await Promise.all(
          enabledChainsList.map(async (chainName) => {
            try {
              const chain = SUPPORTED_CHAINS[chainName];
              if (!chain) return;

              // Track loading state
              loadingChainsSet.add(chainName);
              setLoadingChains(new Set(loadingChainsSet));

              // Get chain-specific address
              const chainAddress = getAddressForChain(cosmosAddress, chain.chainId);
              if (!chainAddress) {
                console.warn(`Could not convert address for ${chainName}`);
                return;
              }

              // Get token price
              const price = await fetchPrice(chainName);

              // Fetch balances
              const balance = await fetchChainBalances(chainAddress, chainName, price);
              if (balance) {
                newBalances[chainName] = balance;
              }
            } catch (err) {
              logError(err, `Failed to fetch ${chainName} balances`, true);
            } finally {
              loadingChainsSet.delete(chainName);
              setLoadingChains(new Set(loadingChainsSet));
            }
          })
        );

        setBalances(newBalances);
        setCachedBalances(newBalances);
      } catch (err) {
        setError(logError(err, "Fetching multi-chain balances"));
      } finally {
        setIsLoading(false);
        setLoadingChains(new Set());
      }
    };

    fetchBalances();
  }, [cosmosAddress, enabledChains, getCachedBalances, setCachedBalances, fetchPrice]);

  return {
    balances,
    isLoading,
    loadingChains,
    error
  };
}