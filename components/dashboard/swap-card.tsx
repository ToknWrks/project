"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SwapForm } from "@/components/swap/swap-form";

interface SwapCardProps {
  chainName?: string;
}

export function SwapCard({ chainName = 'osmosis' }: SwapCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Swap</CardTitle>
      </CardHeader>
      <CardContent>
        <SwapForm chainName={chainName} onClose={() => {}} />
      </CardContent>
    </Card>
  );
}