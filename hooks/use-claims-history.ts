import { useState, useCallback } from "react";
import { fetchClaimHistory, type ClaimEvent } from "@/lib/api/services/claims";

export function useClaimsHistory(chainName: string = 'osmosis') {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (address: string): Promise<ClaimEvent[]> => {
    if (!address) {
      setError("No address provided");
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const { claims, error: fetchError } = await fetchClaimHistory(address, chainName);
      
      if (fetchError) {
        setError(fetchError);
        return [];
      }

      return claims;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch claims history";
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [chainName]);

  return {
    fetchClaimsHistory: fetchHistory,
    isLoading,
    error
  };
}

export type { ClaimEvent };