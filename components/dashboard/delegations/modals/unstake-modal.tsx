import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useUnstake } from "@/hooks/staking/use-unstake";
import { SUPPORTED_CHAINS } from "@/lib/constants/chains";

interface UnstakeModalProps {
  open: boolean;
  onClose: () => void;
  chainName: string;
  validatorAddress: string;
  validatorName: string;
  onSuccess?: () => void;
}

export function UnstakeModal({
  open,
  onClose,
  chainName,
  validatorAddress,
  validatorName,
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unstake {chain.symbol}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Amount to Unstake</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              From validator: {validatorName}
            </p>
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

          <Button onClick={handleUnstake} disabled={!amount || isLoading}>
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