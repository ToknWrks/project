import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";

interface ChainCardProps {
  chainName: string;
  chain: {
    name: string;
    symbol: string;
    icon?: string;
  };
  balance: {
    available: string;
    staked: string;
    rewards: string;
    usdValues: {
      available: string;
      staked: string;
      rewards: string;
      total: string;
    };
  };
}

export function ChainCard({ chainName, chain, balance }: ChainCardProps) {
  const href = chainName === 'osmosis' ? '/' : `/${chainName}`;
  const hasBalance = Number(balance.available) > 0 || 
                    Number(balance.staked) > 0 || 
                    Number(balance.rewards) > 0;

  return (
    <Link href={href}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
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
}