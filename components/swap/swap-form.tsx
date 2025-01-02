"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowDownUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { useKeplr } from "@/hooks/use-keplr";
import { useToast } from "@/components/ui/use-toast";
import { useSwap } from "@/hooks/swap/use-swap";
import { TokenSelect } from "./token-select";
import { ChainSelect } from "./chain-select";
import { SlippageSelect } from "./slippage-select";
import { SwapDetails } from "./swap-details";
import { getChainToken } from "@/lib/constants/tokens";

interface SwapFormProps {
  onClose: () => void;
  chainName?: string;
}

export function SwapForm({ onClose, chainName = 'osmosis' }: SwapFormProps) {
  const { address, status } = useKeplr(chainName);
  const { toast } = useToast();
  const {
    fromToken,
    toToken,
    estimatedAmount,
    isLoading,
    isExecuting,
    error,
    getEstimate,
    executeSwap,
    switchTokens,
    setFromToken,
    setToToken,
  } = useSwap(chainName);

  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("1.0");

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value) {
      getEstimate(value);
    }
  };

  const fromTokenInfo = getChainToken(chainName);
  const fromSymbol = fromTokenInfo?.symbol || "OSMO";
  const toSymbol = "USDC";

  return (
    <div className="grid gap-4">
      {/* From Section */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label>From</Label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Slippage</span>
              <SlippageSelect
                value={slippage}
                onValueChange={setSlippage}
                onCustomChange={setSlippage}
              />
            </div>
            <ChainSelect
              value={fromToken}
              onValueChange={setFromToken}
              chainName={chainName}
            />
          </div>
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
            chainName={chainName}
          />
        </div>
      </div>

      {/* Switch Button */}
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

      {/* To Section */}
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label>To</Label>
          <ChainSelect
            value={toToken}
            onValueChange={setToToken}
            chainName="noble"
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

      {/* Swap Details */}
      {estimatedAmount && (
        <SwapDetails
          fromAmount={amount}
          toAmount={estimatedAmount}
          fromSymbol={fromSymbol}
          toSymbol={toSymbol}
          exchangeRate="1.0"
          priceImpact="0.1"
          minimumReceived={estimatedAmount}
          fee="0.1"
        />
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Swap Button */}
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