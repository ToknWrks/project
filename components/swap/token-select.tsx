"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getChainToken } from "@/lib/constants/tokens";
import Image from "next/image";

interface TokenSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  chainName: string;
  isLoading?: boolean;
}

export function TokenSelect({
  value,
  onValueChange,
  chainName,
  isLoading
}: TokenSelectProps) {
  if (isLoading) {
    return <Skeleton className="h-10 w-[120px]" />;
  }

  const token = getChainToken(chainName);
  if (!token) return null;

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue>
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
            {token.symbol}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={token.denom}>
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
      </SelectContent>
    </Select>
  );
}