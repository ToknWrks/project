"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SUPPORTED_CHAINS } from "@/lib/constants/chains";
import Image from "next/image";

interface ChainSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  excludeChain?: string;
  isLoading?: boolean;
  chainName?: string;
}

export function ChainSelect({
  value,
  onValueChange,
  excludeChain,
  isLoading,
  chainName = 'osmosis'
}: ChainSelectProps) {
  if (isLoading) {
    return <Skeleton className="h-10 w-[140px]" />;
  }

  // Get default chain if no value is provided
  const defaultChain = SUPPORTED_CHAINS[chainName];
  const defaultChainId = defaultChain?.chainId || 'osmosis-1';

  // Use provided value or fall back to default
  const currentValue = value || defaultChainId;

  // Convert chain ID to internal name (e.g. "osmosis-1" -> "osmosis")
  const internalName = currentValue.split('-')[0];
  const selectedChain = SUPPORTED_CHAINS[internalName];

  // Filter and map chains for selection
  const chains = Object.entries(SUPPORTED_CHAINS)
    .filter(([name]) => name !== excludeChain)
    .map(([_, chain]) => ({
      id: chain.chainId,
      name: chain.name,
      icon: chain.icon
    }));

  return (
    <Select value={currentValue} onValueChange={onValueChange}>
      <SelectTrigger className="w-[140px]">
        <div className="flex items-center gap-2">
          {selectedChain?.icon && (
            <div className="relative w-4 h-4">
              <Image
                src={selectedChain.icon}
                alt={selectedChain.name}
                fill
                className="object-contain"
              />
            </div>
          )}
          <span>{selectedChain?.name || 'Select Chain'}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => (
          <SelectItem key={chain.id} value={chain.id}>
            <div className="flex items-center gap-2">
              {chain.icon && (
                <div className="relative w-4 h-4">
                  <Image
                    src={chain.icon}
                    alt={chain.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span>{chain.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}