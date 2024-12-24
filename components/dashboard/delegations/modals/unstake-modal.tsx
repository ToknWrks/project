import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useUnstake } from "@/hooks/staking/use-unstake";
import { SUPPORTED_CHAINS } from "@/lib/constants/chains";
import { formatNumber } from "@/lib/utils";

interface UnstakeModalProps {
  open: boolean;
  onClose: () => void;
  chainName: string;
  validatorAddress: string;
  validatorName: string;
  delegatedAmount: string;
  onSuccess?: () => void;
}

export function UnstakeModal({
  open,
  onClose,
  chainName,
  validatorAddress,
  validatorName,
  delegatedAmount,
  onSuccess
}: UnstakeModalProps) {
  const [amount, setAmount] = useState("");
  const { unstake, isLoading, error } = useUnstake(chainName);
  const chain = SUPPORTED_CHAINS[chainName as keyof typeof SUPPORTED_CHAINS];

  const handleUnstake = async () => {
    const success = await unstake({
      validatorAddress,
      amount
    });

    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  const availableToUnstake = formatNumber(delegatedAmount, 6);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unstake {chain.symbol}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Amount to Unstake</Label>
              <span className="text-sm text-muted-foreground">
                Available: {availableToUnstake} {chain.symbol}
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
                From validator: {validatorName}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount(availableToUnstake)}
              >
                Max
              </Button>
            </div>
          </div>

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Unstaking takes {chain.unbondingDays || 14} days to complete. You will not earn rewards during this period.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleUnstake} 
            disabled={!amount || isLoading || Number(amount) > Number(delegatedAmount)}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Unstaking...
              </>
            ) : (
              'Unstake'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}