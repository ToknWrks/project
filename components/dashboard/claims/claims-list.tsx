import { ClaimEvent } from "@/hooks/use-claims-history";
import { ClaimEvent as ClaimEventComponent } from "./claim-event";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useClaimsHistory } from "@/hooks/use-claims-history";

interface ClaimsListProps {
  chainName?: string;
  address?: string;
}

export function ClaimsList({ chainName = 'osmosis', address }: ClaimsListProps) {
  const { fetchClaimsHistory, isLoading, error } = useClaimsHistory(chainName);
  const [claims, setClaims] = useState<ClaimEvent[]>([]);

  useEffect(() => {
    async function loadClaims() {
      if (!address) return;
      const history = await fetchClaimsHistory(address);
      setClaims(history);
    }

    loadClaims();
  }, [address, chainName, fetchClaimsHistory]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!claims.length) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>No claims history found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {claims.map((claim, index) => (
        <ClaimEventComponent
          key={`${claim.txHash}-${index}`}
          {...claim}
          chainName={chainName}
        />
      ))}
    </div>
  );
}