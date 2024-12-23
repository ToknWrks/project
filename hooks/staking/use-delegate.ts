import { useState, useCallback } from 'react';
import { useKeplr } from '@/hooks/use-keplr';
import { useToast } from '@/components/ui/use-toast';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { logError } from '@/lib/error-handling';
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';

interface DelegateParams {
  validatorAddress: string;
  amount: string;
}

export function useDelegate(chainName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, getSigningClient } = useKeplr(chainName);
  const { toast } = useToast();

  const delegate = useCallback(async ({ validatorAddress, amount }: DelegateParams) => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const client = await getSigningClient();
      if (!client) throw new Error("Failed to get signing client");

      const chain = SUPPORTED_CHAINS[chainName as keyof typeof SUPPORTED_CHAINS];
      if (!chain) throw new Error(`Unsupported chain: ${chainName}`);

      const msg = {
        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
        value: MsgDelegate.fromPartial({
          delegatorAddress: address,
          validatorAddress,
          amount: {
            denom: chain.denom,
            amount: (Number(amount) * Math.pow(10, chain.decimals)).toString()
          }
        })
      };

      const tx = await client.signAndBroadcast(
        address,
        [msg],
        {
          amount: [{ amount: "5000", denom: chain.denom }],
          gas: "200000"
        }
      );

      if (tx.code !== 0) {
        throw new Error(tx.rawLog || "Failed to delegate");
      }

      toast({
        title: "Success",
        description: `Successfully delegated ${amount} ${chain.symbol}`
      });

      return true;
    } catch (err) {
      const message = logError(err, "Failed to delegate");
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, chainName, getSigningClient, toast]);

  return {
    delegate,
    isLoading,
    error
  };
}