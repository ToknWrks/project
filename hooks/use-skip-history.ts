import { useState, useCallback } from "react";
import { fetchClaimHistory, type ClaimEvent } from "@/lib/api/skip-history";

interface SkipHistoryState {
  claims: ClaimEvent[];
  isLoading: boolean;
  error: string | null;
}

export function useSkipHistory() {
  const [state, setState] = useState<SkipHistoryState>({
    claims: [],
    isLoading: false,
    error: null
  });

  const fetchHistory = useCallback(async (address: string, chainName: string = 'osmosis') => {
    if (!address) {
      setState(prev => ({ ...prev, error: "No address provided" }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const { claims, error } = await fetchClaimHistory(address, chainName);
    
    setState({
      claims,
      isLoading: false,
      error: error || null
    });
  }, []);

  return {
    ...state,
    fetchClaimHistory: fetchHistory
  };
}

export type { ClaimEvent };