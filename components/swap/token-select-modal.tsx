```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useState } from "react";
import { Token } from "@/lib/constants/tokens";

interface TokenSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  tokens: Token[];
  title: string;
}

export function TokenSelectModal({
  open,
  onClose,
  onSelect,
  tokens,
  title
}: TokenSelectModalProps) {
  const [search, setSearch] = useState("");

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(search.toLowerCase()) ||
    token.symbol.toLowerCase().includes(search.toLowerCase())
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
            placeholder="Search tokens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {filteredTokens.map((token) => (
              <button
                key={token.denom}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
              >
                {token.logo && (
                  <div className="relative w-8 h-8">
                    <Image
                      src={token.logo}
                      alt={token.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex flex-col items-start">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-sm text-muted-foreground">{token.name}</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
```