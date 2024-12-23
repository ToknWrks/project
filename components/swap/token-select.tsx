import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAvailableTokens } from "@/hooks/tokens/use-available-tokens";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { NOBLE_USDC } from "@/lib/constants/tokens";

interface TokenSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  chainName: string;
  isLoading?: boolean;
}

export function TokenSelect({ value, onValueChange, chainName, isLoading }: TokenSelectProps) {
  // For Noble (destination chain), we only show USDC
  if (chainName === 'noble') {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              <div className="relative w-4 h-4">
                <Image
                  src={NOBLE_USDC.logo}
                  alt={NOBLE_USDC.name}
                  fill
                  className="object-contain"
                />
              </div>
              {NOBLE_USDC.symbol}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NOBLE_USDC.denom}>
            <div className="flex items-center gap-2">
              <div className="relative w-4 h-4">
                <Image
                  src={NOBLE_USDC.logo}
                  alt={NOBLE_USDC.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span>{NOBLE_USDC.symbol}</span>
                <span className="text-xs text-muted-foreground">{NOBLE_USDC.name}</span>
              </div>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  // For source chain, show available tokens
  const { tokens, nativeTokens, ibcTokens, isLoading: isLoadingTokens, error } = useAvailableTokens(chainName);

  if (isLoading || isLoadingTokens) {
    return <Skeleton className="h-10 w-[120px]" />;
  }

  const selectedToken = tokens.find(t => t.denom === value);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (tokens.length === 0) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          No tokens available in your wallet
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            {selectedToken?.logo && (
              <div className="relative w-4 h-4">
                <Image
                  src={selectedToken.logo}
                  alt={selectedToken.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            {selectedToken?.symbol}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[300px]">
          {nativeTokens.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-sm font-semibold">Native Tokens</div>
              {nativeTokens.map((token) => (
                <SelectItem
                  key={token.denom}
                  value={token.denom}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    {token.logo && (
                      <div className="relative w-4 h-4">
                        <Image
                          src={token.logo}
                          alt={token.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span>{token.symbol}</span>
                      <span className="text-xs text-muted-foreground">{token.name}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </>
          )}

          {ibcTokens.length > 0 && (
            <>
              <Separator className="my-2" />
              <div className="px-2 py-1.5 text-sm font-semibold">IBC Tokens</div>
              {ibcTokens.map((token) => (
                <SelectItem
                  key={token.denom}
                  value={token.denom}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    {token.logo && (
                      <div className="relative w-4 h-4">
                        <Image
                          src={token.logo}
                          alt={token.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span>{token.symbol}</span>
                      <span className="text-xs text-muted-foreground">{token.name}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </>
          )}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}