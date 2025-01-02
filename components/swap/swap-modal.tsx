"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SwapForm } from "./swap-form";

interface SwapModalProps {
  open: boolean;
  onClose: () => void;
  chainName?: string;
}

export function SwapModal({ open, onClose, chainName = 'osmosis' }: SwapModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Swap Tokens</DialogTitle>
        </DialogHeader>
        <SwapForm onClose={onClose} chainName={chainName} />
      </DialogContent>
    </Dialog>
  );
}