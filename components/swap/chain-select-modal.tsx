```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useState } from "react";
import { SUPPORTED_CHAINS } from "@/lib/constants/chains";

interface ChainSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (chainId: string) => void;
  excludeChain?: string;
  title: string;
}

export function ChainSelectModal({
  open,
  onClose,
  onSelect,
  excludeChain,
  title
}: ChainSelectModalProps) {
  const [search, setSearch] = useState("");

  const chains = Object.entries(SUPPORTED_CHAINS)
    .filter(([chainId]) => chainId !== excludeChain)
    .filter(([_, chain]) => 
      chain.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search chains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {chains.map(([chainId, chain]) => (
              <button
                key={chainId}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => {
                  onSelect(chainId);
                  onClose();
                }}
              >
                {chain.icon && (
                  <div className="relative w-8 h-8">
                    <Image
                      src={chain.icon}
                      alt={chain.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <span className="font-medium">{chain.name}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
```