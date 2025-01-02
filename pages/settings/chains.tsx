import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChainSearch } from "@/components/dashboard/chain-search";
import { useChainSettings } from "@/hooks/use-chain-settings";
import Image from "next/image";
import { useKeplr } from "@/hooks/use-keplr";
import { useMultiChainBalances } from "@/hooks/use-multi-chain-balances";
import { useState, useMemo } from "react";
import Link from "next/link";
import { SUPPORTED_CHAINS } from "@/lib/constants/chains";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChainSettingsPage() {
  const { toggleChain, toggleAll, isChainEnabled } = useChainSettings();
  const { status } = useKeplr();
  const { balances } = useMultiChainBalances(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort chains
  const filteredChains = useMemo(() => {
    return Object.entries(SUPPORTED_CHAINS)
      .filter(([_, chain]) => 
        chain.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const [aKey, aChain] = a;
        const [bKey, bChain] = b;
        
        // Sort by balance first
        const aHasBalance = Boolean(balances[aKey]);
        const bHasBalance = Boolean(balances[bKey]);
        if (aHasBalance !== bHasBalance) {
          return bHasBalance ? 1 : -1;
        }
        
        // Then sort alphabetically
        return aChain.name.localeCompare(bChain.name);
      });
  }, [searchQuery, balances]);

  const chainIds = filteredChains.map(([chainName]) => chainName);
  const allEnabled = chainIds.every(chain => isChainEnabled(chain));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Chain Settings</h1>
          <Link 
            href="/chains"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View All Chains
          </Link>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Enabled Chains</CardTitle>
            <div className="flex items-center gap-4">
              <ChainSearch value={searchQuery} onChange={setSearchQuery} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAll(chainIds)}
              >
                {allEnabled ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChains.map(([chainName, chain]) => {
                  const chainHasBalance = Boolean(balances[chainName]);
                  const isEnabled = isChainEnabled(chainName);
                  const isCosmoshub = chainName === 'cosmoshub';
                  
                  return (
                    <div
                      key={chainName}
                      className={`flex items-center space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors border ${
                        chainHasBalance ? 'bg-muted/30' : ''
                      }`}
                    >
                      <Checkbox
                        id={chainName}
                        checked={isEnabled}
                        onCheckedChange={() => toggleChain(chainName)}
                        disabled={isCosmoshub} // Osmosis is always enabled
                      />
                      {chain.icon && (
                        <div className="h-8 w-8 relative flex-shrink-0">
                          <Image
                            src={chain.icon}
                            alt={chain.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="flex flex-col flex-1 min-w-0">
                        <label
                          htmlFor={chainName}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer truncate"
                        >
                          {chain.name}
                          {isCosmoshub && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (Default)
                            </span>
                          )}
                        </label>
                        {chainHasBalance && (
                          <span className="text-xs text-muted-foreground mt-1">
                            Has balance
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}