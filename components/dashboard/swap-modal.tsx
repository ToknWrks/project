import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SwapForm } from "@/components/swap/swap-form";

interface SwapModalProps {
  open: boolean;
  onClose: () => void;
}

export function SwapModal({ open, onClose }: SwapModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Swap Tokens</DialogTitle>
        </DialogHeader>
        <SwapForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}