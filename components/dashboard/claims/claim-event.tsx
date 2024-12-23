import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { getExplorerUrl } from "@/lib/utils/explorer";

interface ClaimEventProps {
  amount: string;
  timestamp: string;
  validatorName: string;
  usdValue: string;
  txHash: string;
  chainName: string;
}

export function ClaimEvent({ 
  amount, 
  timestamp, 
  validatorName, 
  usdValue, 
  txHash, 
  chainName 
}: ClaimEventProps) {
  const explorerUrl = getExplorerUrl(chainName, txHash);
  const tokenSymbol = chainName === 'osmosis' ? 'OSMO' : chainName.toUpperCase();
  const formattedAmount = formatNumber(Number(amount), 6);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{validatorName}</span>
          <Link 
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
        <span className="text-sm text-muted-foreground">{timestamp}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <Badge variant="outline">
            {formattedAmount} {tokenSymbol}
          </Badge>
          <div className="text-xs text-muted-foreground mt-1">
            ${usdValue}
          </div>
        </div>
      </div>
    </div>
  );
}