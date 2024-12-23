import { Card, CardContent } from "@/components/ui/card";
import { formatNumber, formatUSD } from "@/lib/utils/format";

interface SwapDetailsProps {
  fromAmount: string;
  toAmount: string;
  fromSymbol: string;
  toSymbol: string;
  exchangeRate: string;
  priceImpact: string;
  minimumReceived: string;
  fee: string;
}

export function SwapDetails({
  fromAmount,
  toAmount,
  fromSymbol,
  toSymbol,
  exchangeRate,
  priceImpact,
  minimumReceived,
  fee
}: SwapDetailsProps) {
  return (
    <Card className="mt-4">
      <CardContent className="pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Exchange Rate</span>
          <span>1 {fromSymbol} ≈ {formatNumber(exchangeRate)} {toSymbol}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Price Impact</span>
          <span className={Number(priceImpact) > 1 ? "text-destructive" : ""}>
            {priceImpact}%
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Minimum Received</span>
          <span>{formatNumber(minimumReceived)} {toSymbol}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Network Fee</span>
          <span>{formatUSD(Number(fee))}</span>
        </div>
      </CardContent>
    </Card>
  );
}