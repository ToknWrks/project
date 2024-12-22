"use client";

import { useState, useCallback } from 'react';
import { useKeplr } from './use-keplr';
import { useToast } from "@/components/ui/use-toast";
import { claimChainRewards } from '@/lib/api/rewards';

export function useClaimRewards(chainName: string = 'osmosis') {
  const [isLoading, setIsLoading] = useState(false);
  const { address, getSigningClient } = useKeplr(chainName);
  const { toast } = useToast();

  const claimRewards = useCallback(async (validatorAddresses: string[]) => {
    if (!address || !validatorAddresses.length) {
      toast({
        title: "Error",
        description: "No validators selected for claiming rewards",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);

    try {
      const client = await getSigningClient();
      if (!client) {
        throw new Error("Failed to get signing client");
      }

      await claimChainRewards({
        chainName,
        address,
        validatorAddresses,
        client
      });

      toast({
        title: "Success",
        description: "Successfully claimed rewards"
      });

      // Wait briefly before reloading to allow state updates
      setTimeout(() => window.location.reload(), 1000);
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to claim rewards";
      console.error('Error claiming rewards:', message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, getSigningClient, chainName, toast]);

  return {
    claimRewards,
    isLoading
  };
}