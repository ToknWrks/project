"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { ChainCard } from "./chain-card";
import { useChainSettings } from '@/hooks/use-chain-settings';

interface Chain {
  name: string;
  symbol: string;
  icon?: string;
}

interface Balance {
  available: string;
  staked: string;
  rewards: string;
  usdValues: {
    available: string;
    staked: string;
    rewards: string;
    total: string;
  };
}

interface ChainData {
  chainName: string;
  chain: Chain;
  balance: Balance;
}

interface ChainsListProps {
  chains: ChainData[];
  isLoading: boolean;
}

export function ChainsList({ chains, isLoading }: ChainsListProps) {
  const { enabledChains } = useChainSettings();
  
  // Filter chains to only show enabled ones
  const enabledChainsList = chains.filter(({ chainName }) => enabledChains.has(chainName));

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (enabledChainsList.length === 0) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          No chains enabled. Enable chains in settings to view balances.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {enabledChainsList.map((chainData) => (
        <ChainCard 
          key={chainData.chainName}
          {...chainData}
        />
      ))}
    </div>
  );
}