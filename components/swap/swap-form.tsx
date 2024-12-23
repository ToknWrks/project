import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TokenSelect } from "./token-select";
import { ChainSelect } from "./chain-select";
import { SlippageSelect } from "./slippage-select";
import { SwapDetails } from "./swap-details";
import { ArrowDownUp, Loader2 } from "lucide-react";
import { useSwapStore } from "@/hooks/swap/use-swap-store";
import { useKeplr } from "@/hooks/use-keplr";
import { useSwap } from "@/hooks/swap/use-swap";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { OSMOSIS_TOKENS, NOBLE_USDC } from "@/lib/constants/tokens";

interface SwapFormProps {
  onClose: () => void;
}

export function SwapForm({ onClose }: SwapFormProps) {
  const { 
    fromChain,
    toChain,
    fromToken, 
    toToken,
    estimatedAmount,
    exchangeRate,
    priceImpact,
    minimumReceived,
    fee,
    slippage,
    isLoading,
    isExecuting,
    error,
    setFromChain,
    setToChain,
    setFromToken,
    setToToken,
    setSlippage
  } = useSwapStore();
  
  const { status } = useKeplr();
  const { getEstimate, executeSwap, switchTokens } = useSwap();
  
  const [amount, setAmount] = useState("");

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value) {
      getEstimate(value);
    }
  };

  const fromSymbol = OSMOSIS_TOKENS.find(t => t.denom === fromToken)?.symbol || "OSMO";
  const toSymbol = toToken === NOBLE_USDC.denom ? NOBLE_USDC.symbol : "OSMO";

  return (
    <div className="grid gap-6 py-4">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label>From</Label>
          <ChainSelect
            value={fromChain}
            onValueChange={setFromChain}
            excludeChain={toChain}
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
          <TokenSelect
            value={fromToken}
            onValueChange={setFromToken}
            chainName="osmosis"
          />
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={switchTokens}
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label>To</Label>
          <ChainSelect
            value={toChain}
            onValueChange={setToChain}
            excludeChain={fromChain}
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="0.00"
            value={estimatedAmount}
            disabled
          />
          <TokenSelect
            value={toToken}
            onValueChange={setToToken}
            chainName="noble"
          />
        </div>
      </div>

      <SlippageSelect
        value={slippage}
        onValueChange={setSlippage}
        onCustomChange={setSlippage}
      />

      {estimatedAmount && (
        <SwapDetails
          fromAmount={amount}
          toAmount={estimatedAmount}
          fromSymbol={fromSymbol}
          toSymbol={toSymbol}
          exchangeRate={exchangeRate}
          priceImpact={priceImpact}
          minimumReceived={minimumReceived}
          fee={fee}
        />
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button
        onClick={() => executeSwap(amount)}
        disabled={!amount || isLoading || isExecuting || status !== 'Connected'}
      >
        {isExecuting ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Swapping...
          </span>
        ) : isLoading ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting estimate...
          </span>
        ) : status !== 'Connected' ? (
          'Connect Wallet'
        ) : !amount ? (
          'Enter amount'
        ) : (
          'Swap'
        )}
      </Button>
    </div>
  );
}