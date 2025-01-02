import { Header } from "@/components/dashboard/header";
import { useKeplr } from "@/hooks/use-keplr";
import { useMultiChainBalances } from "@/hooks/use-multi-chain-balances";
import { AssetsChart } from "@/components/dashboard/assets-chart";
import { ChainList } from "@/components/dashboard/chain-list";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useEffect } from "react";
import { ChainsHeader } from "@/components/dashboard/chains/header";

export default function ChainsPage() {
  const { address, status, connect, isLoading: isConnecting } = useKeplr('cosmoshub');
  const { balances, isLoading, loadingChains } = useMultiChainBalances(
    status === 'Connected' ? address : undefined
  );

  // Auto-connect when page loads
  useEffect(() => {
    if (status === 'Disconnected' && !isConnecting) {
      connect();
    }
  }, [status, isConnecting, connect]);

  // Calculate total value across all chains
  const totalValue = Object.values(balances).reduce((sum, balance) => {
    return sum + Number(balance.usdValues.total);
  }, 0).toFixed(2);

  // Prepare chart data
  const chartData = Object.entries(balances)
    .filter(([_, balance]) => Number(balance.usdValues.total) > 0)
    .map(([chainName, balance]) => ({
      name: chainName.toUpperCase(),
      value: Number(balance.usdValues.total),
      symbol: chainName.toUpperCase()
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="flex min-h-screen flex-col">
      <Header chainName="cosmoshub" />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <ChainsHeader title="All Chains" />

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

            <ChainList 
              balances={balances}
              isLoading={isLoading}
              loadingChains={loadingChains}
            />
          </>
        )}
      </main>
    </div>
  );
}