import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { useRedelegate } from "@/hooks/staking/use-redelegate";
import { useValidators } from "@/hooks/staking/use-validators";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SUPPORTED_CHAINS } from "@/lib/constants/chains";

interface RedelegateModalProps {
  open: boolean;
  onClose: () => void;
  chainName: string;
  sourceValidatorAddress: string;
  sourceValidatorName: string;
  onSuccess?: () => void;
}

export function RedelegateModal({
  open,
  onClose,
  chainName,
  sourceValidatorAddress,
  sourceValidatorName,
  onSuccess
}: RedelegateModalProps) {
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [selectedValidator, setSelectedValidator] = useState("");
  const { redelegate, isLoading, error } = useRedelegate(chainName);
  const { validators, isLoading: isLoadingValidators } = useValidators(chainName);
  const chain = SUPPORTED_CHAINS[chainName as keyof typeof SUPPORTED_CHAINS];

  const filteredValidators = validators.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) &&
    v.address !== sourceValidatorAddress
  );

  const handleRedelegate = async () => {
    if (!selectedValidator) return;

    const success = await redelegate({
      fromValidatorAddress: sourceValidatorAddress,
      toValidatorAddress: selectedValidator,
      amount
    });

    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Redelegate {chain.symbol}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Amount to Redelegate</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              From validator: {sourceValidatorName}
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Select Validator</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search validators..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-[200px] rounded-md border">
              <RadioGroup
                value={selectedValidator}
                onValueChange={setSelectedValidator}
                className="p-2"
              >
                {isLoadingValidators ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredValidators.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No validators found
                  </div>
                ) : (
                  filteredValidators.map((validator) => (
                    <div key={validator.address} className="flex items-center space-x-2 p-2">
                      <RadioGroupItem value={validator.address} id={validator.address} />
                      <Label htmlFor={validator.address} className="flex-1">
                        <div className="flex flex-col">
                          <span>{validator.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Commission: {(Number(validator.commission) * 100).toFixed(2)}%
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))
                )}
              </RadioGroup>
            </ScrollArea>
          </div>

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Redelegation will take effect immediately. You will continue earning rewards.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleRedelegate} 
            disabled={!amount || !selectedValidator || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redelegating...
              </>
            ) : (
              'Redelegate'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}