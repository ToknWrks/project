import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPPORTED_CHAINS } from "@/lib/constants/chains";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface ChainSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  excludeChain?: string;
  isLoading?: boolean;
}

export function ChainSelect({ value, onValueChange, excludeChain, isLoading }: ChainSelectProps) {
  if (isLoading) {
    return <Skeleton className="h-10 w-[140px]" />;
  }

  // Filter out excluded chain
  const chains = Object.entries(SUPPORTED_CHAINS)
    .filter(([key]) => key !== excludeChain)
    .map(([key, chain]) => ({
      id: chain.chainId,
      name: chain.name,
      logo: chain.icon
    }));

  const selectedChain = chains.find(chain => chain.id === value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            {selectedChain?.logo && (
              <div className="relative w-4 h-4">
                <Image
                  src={selectedChain.logo}
                  alt={selectedChain.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            {selectedChain?.name}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => (
          <SelectItem
            key={chain.id}
            value={chain.id}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2">
              {chain.logo && (
                <div className="relative w-4 h-4">
                  <Image
                    src={chain.logo}
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