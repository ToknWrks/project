"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SlippageSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  onCustomChange: (value: string) => void;
}

const SLIPPAGE_OPTIONS = [
  { value: "0.5", label: "0.5%" },
  { value: "1.0", label: "1.0%" },
  { value: "3.0", label: "3.0%" },
  { value: "custom", label: "Custom" }
];

export function SlippageSelect({
  value,
  onValueChange,
  onCustomChange
}: SlippageSelectProps) {
  const isCustom = !SLIPPAGE_OPTIONS.some(option => option.value === value);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={isCustom ? "custom" : value}
        onValueChange={(val) => {
          if (val === "custom") {
            onCustomChange("");
          } else {
            onValueChange(val);
          }
        }}
      >
        <SelectTrigger className="w-[80px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SLIPPAGE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isCustom && (
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={value}
            onChange={(e) => onCustomChange(e.target.value)}
            className="w-[60px] h-8"
            placeholder="0.00"
          />
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      )}
    </div>
  );
}