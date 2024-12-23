import { useState, useCallback } from 'react';
import { useKeplr } from '@/hooks/use-keplr';
import { useToast } from '@/components/ui/use-toast';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { logError } from '@/lib/error-handling';
import { MsgBeginRedelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';

interface RedelegateParams {
  fromValidatorAddress: string;
  toValidatorAddress: string;
  amount: string;
}

export function useRedelegate(chainName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, getSigningClient } = useKeplr(chainName);
  const { toast } = useToast();

  const redelegate = useCallback(async ({ 
    fromValidatorAddress, 
    toValidatorAddress, 
    amount 
  }: RedelegateParams) => {
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
        typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
        value: MsgBeginRedelegate.fromPartial({
          delegatorAddress: address,
          validatorSrcAddress: fromValidatorAddress,
          validatorDstAddress: toValidatorAddress,
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
          gas: "250000"
        }
      );

      if (tx.code !== 0) {
        throw new Error(tx.rawLog || "Failed to redelegate");
      }

      toast({
        title: "Success",
        description: `Successfully redelegated ${amount} ${chain.symbol}`
      });

      return true;
    } catch (err) {
      const message = logError(err, "Failed to redelegate");
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
    redelegate,
    isLoading,
    error
  };
}