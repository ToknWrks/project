import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { UnstakeModal } from "./modals/unstake-modal";
import { RedelegateModal } from "./modals/redelegate-modal";
import { DelegateModal } from "./modals/delegate-modal";

interface DelegationActionsProps {
  chainName: string;
  validatorAddress: string;
  validatorName: string;
  onSuccess?: () => void;
}

export function DelegationActions({ 
  chainName,
  validatorAddress,
  validatorName,
  onSuccess 
}: DelegationActionsProps) {
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [showRedelegateModal, setShowRedelegateModal] = useState(false);
  const [showDelegateModal, setShowDelegateModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowDelegateModal(true)}>
            Delegate More
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowUnstakeModal(true)}>
            Unstake
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowRedelegateModal(true)}>
            Redelegate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UnstakeModal
        open={showUnstakeModal}
        onClose={() => setShowUnstakeModal(false)}
        chainName={chainName}
        validatorAddress={validatorAddress}
        validatorName={validatorName}
        onSuccess={onSuccess}
      />

      <RedelegateModal
        open={showRedelegateModal}
        onClose={() => setShowRedelegateModal(false)}
        chainName={chainName}
        sourceValidatorAddress={validatorAddress}
        sourceValidatorName={validatorName}
        onSuccess={onSuccess}
      />

      <DelegateModal
        open={showDelegateModal}
        onClose={() => setShowDelegateModal(false)}
        chainName={chainName}
        validatorAddress={validatorAddress}
        validatorName={validatorName}
        onSuccess={onSuccess}
      />
    </>
  );
}