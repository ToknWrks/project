import { Header } from "@/components/dashboard/header";
import { useKeplr } from "@/hooks/use-keplr";
import { useMultiChainBalances } from "@/hooks/use-multi-chain-balances";
import { AssetsChart } from "@/components/dashboard/assets-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useChainSettings } from "@/hooks/use-chain-settings";
import Link from "next/link";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { formatNumber } from "@/lib/utils";

export default function ChainsPage() {
  const { address, status } = useKeplr();
  const { balances, isLoading, loadingChains } = useMultiChainBalances(
    status === 'Connected' ? address : undefined
  );
  const { chains, enabledChains } = useChainSettings();

  // Get enabled chains with balances
  const chainsWithBalances = useMemo(() => {
    return chains
      .filter(chain => enabledChains.has(chain.chainId.split('-')[0]))
      .map(chain => {
        const chainKey = chain.chainId.split('-')[0];
        return {
          chainName: chainKey,
          chain,
          balance: balances[chainKey] || {
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
        };
      })
      .sort((a, b) => Number(b.balance.usdValues.total) - Number(a.balance.usdValues.total));
  }, [chains, balances, enabledChains]);

  // Calculate total value across all chains
  const totalValue = useMemo(() => {
    return chainsWithBalances.reduce((sum, { balance }) => {
      return sum + Number(balance.usdValues.total);
    }, 0).toFixed(2);
  }, [chainsWithBalances]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return chainsWithBalances
      .filter(({ balance }) => Number(balance.usdValues.total) > 0)
      .map(({ chain, balance }) => ({
        name: chain.symbol,
        value: Number(balance.usdValues.total),
        symbol: chain.symbol
      }));
  }, [chainsWithBalances]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">All Chains</h1>
          <Link 
            href="/settings/chains"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Manage Chains
          </Link>
        </div>

        {!status || status === 'Disconnected' ? (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to view your balances across all chains
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <AssetsChart 
              data={chartData} 
              totalValue={totalValue}
              isLoading={isLoading} 
            />

            {isLoading && !chainsWithBalances.length ? (
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
            ) : chainsWithBalances.length === 0 ? (
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  No chains enabled. Enable chains in settings to view balances.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {chainsWithBalances.map(({ chainName, chain, balance }) => {
                  const href = chainName === 'osmosis' ? '/' : `/${chainName}`;
                  const hasBalance = Number(balance.available) > 0 || 
                                   Number(balance.staked) > 0 || 
                                   Number(balance.rewards) > 0;

                  return (
                    <Link key={chainName} href={href}>
                      <Card className="hover:bg-muted/50 transition-colors cursor-pointer relative">
                        {loadingChains.has(chainName) && (
                          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
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
            )}
          </>
        )}
      </main>
    </div>
  );
}