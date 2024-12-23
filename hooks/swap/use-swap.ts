import { useCallback } from 'react';
import { useKeplr } from '@/hooks/use-keplr';
import { useSwapStore } from './use-swap-store';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { logError } from '@/lib/error-handling';

const SKIP_API_URL = "https://api.skip.money/v2";

export function useSwap() {
  const { address } = useKeplr();
  const { toast } = useToast();
  const store = useSwapStore();

  const getEstimate = useCallback(async (amount: string) => {
    if (!amount || !address) return;

    store.setIsLoading(true);
    store.setError(null);

    try {
      const response = await axios.post(`${SKIP_API_URL}/fungible/route_estimate`, {
        source_asset_chain_id: 'osmosis-1',
        source_asset_denom: store.fromToken,
        dest_asset_chain_id: 'noble-1',
        dest_asset_denom: store.toToken,
        amount: (Number(amount) * 1_000_000).toString(),
        source_asset_type: "native",
        dest_asset_type: "native",
        cumulative_affiliate_fee_bps: "0",
        client_id: "toknwrks"
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      store.setEstimatedAmount(
        (Number(response.data.estimated_amount) / 1_000_000).toFixed(6)
      );
    } catch (err) {
      store.setError(logError(err, 'Failed to get swap estimate'));
    } finally {
      store.setIsLoading(false);
    }
  }, [address, store]);

  const executeSwap = useCallback(async (amount: string) => {
    if (!amount || !address) {
      toast({
        title: "Error",
        description: "Please connect your wallet and enter an amount",
        variant: "destructive"
      });
      return;
    }

    store.setIsExecuting(true);
    store.setError(null);

    try {
      const response = await axios.post(`${SKIP_API_URL}/fungible/route`, {
        source_asset_chain_id: 'osmosis-1',
        source_asset_denom: store.fromToken,
        dest_asset_chain_id: 'noble-1',
        dest_asset_denom: store.toToken,
        amount: (Number(amount) * 1_000_000).toString(),
        source_asset_type: "native",
        dest_asset_type: "native",
        address,
        client_id: "toknwrks",
        slippage_tolerance_percent: "1.0"
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      toast({
        title: "Success",
        description: "Swap executed successfully"
      });

      store.reset();
    } catch (err) {
      const message = logError(err, 'Failed to execute swap');
      store.setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      store.setIsExecuting(false);
    }
  }, [address, store, toast]);

  const switchTokens = useCallback(() => {
    const fromToken = store.fromToken;
    const toToken = store.toToken;
    store.setFromToken(toToken);
    store.setToToken(fromToken);
    store.setEstimatedAmount("0");
    store.setError(null);
  }, [store]);

  return {
    getEstimate,
    executeSwap,
    switchTokens
  };
}