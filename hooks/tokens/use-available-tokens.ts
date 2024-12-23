import { useState, useEffect } from 'react';
import { Token } from '@/lib/constants/tokens';
import { getChainAssets, getIBCTokens } from '@/lib/api/services/tokens';
import { logError } from '@/lib/error-handling';
import { useKeplr } from '@/hooks/use-keplr';
import { retryFetch } from '@/lib/utils/fetch';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';

export function useAvailableTokens(chainName: string) {
  const [nativeTokens, setNativeTokens] = useState<Token[]>([]);
  const [ibcTokens, setIbcTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address, status } = useKeplr(chainName);

  useEffect(() => {
    async function loadTokens() {
      if (!address || status !== 'Connected') {
        setNativeTokens([]);
        setIbcTokens([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const chain = SUPPORTED_CHAINS[chainName as keyof typeof SUPPORTED_CHAINS];
        if (!chain) throw new Error(`Unsupported chain: ${chainName}`);

        // Fetch balances
        const response = await retryFetch(
          `${chain.rest}/cosmos/bank/v1beta1/balances/${address}`
        );
        const data = await response.json();
        const balances = new Map(
          data.balances?.map((b: any) => [b.denom, b.amount]) || []
        );

        // Get all available tokens
        const [native, ibc] = await Promise.all([
          getChainAssets(chainName),
          getIBCTokens(chainName)
        ]);

        // Filter tokens with non-zero balances
        const nativeWithBalances = native.filter(token => 
          Number(balances.get(token.denom) || 0) > 0
        );
        const ibcWithBalances = ibc.filter(token =>
          Number(balances.get(token.denom) || 0) > 0
        );

        setNativeTokens(nativeWithBalances);
        setIbcTokens(ibcWithBalances);
      } catch (err) {
        const message = logError(err, `Failed to load ${chainName} tokens`);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadTokens();
  }, [chainName, address, status]);

  return {
    tokens: [...nativeTokens, ...ibcTokens],
    nativeTokens,
    ibcTokens,
    isLoading,
    error
  };
}