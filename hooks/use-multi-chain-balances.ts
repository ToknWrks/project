import { useState, useEffect } from 'react';
import { useChainSettings } from './use-chain-settings';
import { useChainCache } from './use-chain-cache';
import { useTokenPrice } from './use-token-price';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { fetchChainBalance, fetchChainDelegations, fetchChainRewards } from '@/lib/api/chain';
import { logError } from '@/lib/error-handling';
import { getAddressForChain } from '@/lib/utils/address';

interface ChainBalances {
  [chainName: string]: {
    available: string;
    staked: string;
    rewards: string;
    usdValues: {
      available: string;
      staked: string;
      rewards: string;
      total: string;
    };
  };
}

export function useMultiChainBalances(osmosisAddress?: string) {
  const [balances, setBalances] = useState<ChainBalances>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingChains, setLoadingChains] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const { enabledChains } = useChainSettings();
  const { getBalances: getCachedBalances, setBalances: setCachedBalances } = useChainCache();
  const { fetchPrice } = useTokenPrice();

  useEffect(() => {
    const fetchBalances = async () => {
      if (!osmosisAddress) {
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

      const newBalances: ChainBalances = {};
      const loadingChainsSet = new Set<string>();

      try {
        // Get list of enabled chains
        const enabledChainsList = Array.from(enabledChains)
          .filter(chainName => chainName in SUPPORTED_CHAINS);

        // Fetch data for each chain in parallel
        await Promise.all(
          enabledChainsList.map(async (chainName) => {
            try {
              const chain = SUPPORTED_CHAINS[chainName as keyof typeof SUPPORTED_CHAINS];
              if (!chain) return;

              // Convert Osmosis address to chain-specific address
              const chainAddress = getAddressForChain(osmosisAddress, chain.chainId);
              if (!chainAddress) {
                console.warn(`Could not convert address for ${chainName}`);
                return;
              }

              // Track loading state
              loadingChainsSet.add(chainName);
              setLoadingChains(new Set(loadingChainsSet));

              // Fetch chain data in parallel
              const [available, delegationData, rewards] = await Promise.all([
                fetchChainBalance(chain.rest, chainAddress, chain.denom, chain.decimals),
                fetchChainDelegations(chain.rest, chainAddress, chain.decimals),
                fetchChainRewards(chain.rest, chainAddress, chain.denom, chain.decimals)
              ]);

              // Get token price
              const price = await fetchPrice(chainName);

              // Calculate USD values
              const usdValues = {
                available: (Number(available) * price).toFixed(2),
                staked: (Number(delegationData.stakedBalance) * price).toFixed(2),
                rewards: (Number(rewards) * price).toFixed(2),
                total: ((Number(available) + Number(delegationData.stakedBalance) + Number(rewards)) * price).toFixed(2)
              };

              // Only add chains with non-zero balances
              if (Number(available) > 0 || Number(delegationData.stakedBalance) > 0 || Number(rewards) > 0) {
                newBalances[chainName] = {
                  available,
                  staked: delegationData.stakedBalance,
                  rewards,
                  usdValues
                };
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
        const errorMessage = logError(err, 'Fetching multi-chain balances');
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setLoadingChains(new Set());
      }
    };

    fetchBalances();
  }, [osmosisAddress, enabledChains, getCachedBalances, setCachedBalances, fetchPrice]);

  return {
    balances,
    isLoading,
    loadingChains,
    error
  };
}