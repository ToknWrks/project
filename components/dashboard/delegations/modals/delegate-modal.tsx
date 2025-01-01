import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDelegate } from "@/hooks/staking/use-delegate";
import { useKeplr } from "@/hooks/use-keplr";
import { useChainConfig } from "@/hooks/use-chain-config";
import { formatNumber } from "@/lib/utils";

interface DelegateModalProps {
  open: boolean;
  onClose: () => void;
  chainName: string;
  validatorAddress: string;
  validatorName: string;
  onSuccess?: () => void;
}

export function DelegateModal({
  open,
  onClose,
  chainName,
  validatorAddress,
  validatorName,
  onSuccess
}: DelegateModalProps) {
  const [amount, setAmount] = useState("");
  const { delegate, isLoading, error } = useDelegate(chainName);
  const { balance } = useKeplr(chainName);
  const chain = useChainConfig(chainName);

  const handleDelegate = async () => {
    const success = await delegate({
      validatorAddress,
      amount
    });

    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  const availableBalance = formatNumber(balance, 6);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delegate {chain.symbol}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Amount to Delegate</Label>
              <span className="text-sm text-muted-foreground">
                Available: {availableBalance} {chain.symbol}
              </span>
            </div>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                To validator: {validatorName}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount(availableBalance)}
              >
                Max
              </Button>
            </div>
          </div>

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Delegated tokens are subject to a {chain.unbondingDays || 14}-day unbonding period.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleDelegate} 
            disabled={!amount || isLoading || Number(amount) > Number(balance)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Delegating...
              </>
            ) : (
              'Delegate'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}