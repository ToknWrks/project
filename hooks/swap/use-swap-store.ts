import { create } from 'zustand';
import { NOBLE_USDC } from '@/lib/constants/tokens';

interface SwapState {
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  estimatedAmount: string;
  exchangeRate: string;
  priceImpact: string;
  minimumReceived: string;
  fee: string;
  slippage: string;
  isLoading: boolean;
  isExecuting: boolean;
  error: string | null;
  setFromChain: (chain: string) => void;
  setToChain: (chain: string) => void;
  setFromToken: (token: string) => void;
  setToToken: (token: string) => void;
  setEstimatedAmount: (amount: string) => void;
  setExchangeRate: (rate: string) => void;
  setPriceImpact: (impact: string) => void;
  setMinimumReceived: (amount: string) => void;
  setFee: (fee: string) => void;
  setSlippage: (slippage: string) => void;
  setIsLoading: (loading: boolean) => void;
  setIsExecuting: (executing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  fromChain: 'osmosis-1',
  toChain: 'noble-1',
  fromToken: '',
  toToken: NOBLE_USDC.denom,
  estimatedAmount: "0",
  exchangeRate: "0",
  priceImpact: "0",
  minimumReceived: "0",
  fee: "0",
  slippage: "1.0",
  isLoading: false,
  isExecuting: false,
  error: null
};

export const useSwapStore = create<SwapState>((set) => ({
  ...INITIAL_STATE,
  setFromChain: (chain) => set({ fromChain: chain }),
  setToChain: (chain) => set({ toChain: chain }),
  setFromToken: (token) => set({ fromToken: token }),
  setToToken: (token) => set({ toToken: token }),
  setEstimatedAmount: (amount) => set({ estimatedAmount: amount }),
  setExchangeRate: (rate) => set({ exchangeRate: rate }),
  setPriceImpact: (impact) => set({ priceImpact: impact }),
  setMinimumReceived: (amount) => set({ minimumReceived: amount }),
  setFee: (fee) => set({ fee: fee }),
  setSlippage: (slippage) => set({ slippage: slippage }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsExecuting: (executing) => set({ isExecuting: executing }),
  setError: (error) => set({ error }),
  reset: () => set(INITIAL_STATE)
}));