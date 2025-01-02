```typescript
import { Token } from "@/lib/constants/tokens";

export interface SwapFormProps {
  onClose: () => void;
  chainName?: string;
}

export interface TokenSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  tokens: Token[];
  title: string;
}

export interface ChainSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (chainId: string) => void;
  excludeChain?: string;
  title: string;
}
```