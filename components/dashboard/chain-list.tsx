import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SUPPORTED_CHAINS } from "@/lib/constants/chains";
import { formatNumber } from "@/lib/utils";
import { useChainSettings } from "@/hooks/use-chain-settings";
import Link from "next/link";
import Image from "next/image";

interface ChainListProps {
  balances: Record<string, any>;
  isLoading?: boolean;
  loadingChains?: Set<string>;
}

export function ChainList({ balances, isLoading, loadingChains = new Set() }: ChainListProps) {
  const { enabledChains } = useChainSettings();

  // Show loading skeleton while initially loading
  if (isLoading && !Object.keys(balances).length) {
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

  // Get enabled chains and sort by balance
  const chains = Object.entries(SUPPORTED_CHAINS)
    .filter(([chainName]) => enabledChains.has(chainName))
    .map(([chainName, chain]) => ({
      chainName,
      chain,
      balance: balances[chainName] || {
        available: "0",
        staked: "0",
        rewards: "0",
        usdValues: {
          available: "0",
          staked: "0",
          rewards: "0",
          total: "0"
        }
      }
    }))
    .sort((a, b) => Number(b.balance.usdValues.total) - Number(a.balance.usdValues.total));

  if (!chains.length) {
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
      {chains.map(({ chainName, chain, balance }) => {
        const href = chainName === 'osmosis' ? '/' : `/${chainName}`;

        return (
          <Link key={chainName} href={href}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer relative">
              {loadingChains.has(chainName) && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {chain.name}
                </CardTitle>
                {chain.icon && (
                  <div className="h-8 w-8 relative">
                    <Image
                      src={chain.icon}
                      alt={chain.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  {Number(balance.available) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available:</span>
                      <div className="text-right">
                        <div>{formatNumber(balance.available)} {chain.symbol}</div>
                        <div className="text-xs text-muted-foreground">${balance.usdValues.available}</div>
                      </div>
                    </div>
                  )}
                  {Number(balance.staked) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Staked:</span>
                      <div className="text-right">
                        <div>{formatNumber(balance.staked)} {chain.symbol}</div>
                        <div className="text-xs text-muted-foreground">${balance.usdValues.staked}</div>
                      </div>
                    </div>
                  )}
                  {Number(balance.rewards) > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Claimable:</span>
                      <div className="text-right">
                        <div>{formatNumber(balance.rewards)} {chain.symbol}</div>
                        <div className="text-xs text-muted-foreground">${balance.usdValues.rewards}</div>
                      </div>
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total Value:</span>
                      <span>${balance.usdValues.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}