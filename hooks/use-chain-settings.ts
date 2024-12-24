import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chains } from 'chain-registry';
import { getChainInfo } from '@/lib/utils/chain-registry';

// Get supported chains from registry
const registryChains = chains
  .filter(chain => 
    chain.network_type === 'mainnet' &&
    chain.status === 'live' &&
    chain.chain_name &&
    chain.apis?.rest?.length > 0 &&
    chain.apis?.rpc?.length > 0
  )
  .map(getChainInfo)
  .filter((chain): chain is NonNullable<typeof chain> => chain !== null);

interface ChainSettingsState {
  enabledChains: Set<string>;
  setEnabledChains: (chains: string[]) => void;
  toggleChain: (chainName: string) => void;
  toggleAll: (chains: string[]) => void;
  isChainEnabled: (chainName: string) => boolean;
}

export const useChainSettingsStore = create<ChainSettingsState>()(
  persist(
    (set, get) => ({
      enabledChains: new Set(['osmosis']), // Osmosis enabled by default
      setEnabledChains: (chains) => set({ enabledChains: new Set(chains) }),
      toggleChain: (chainName) => set((state) => {
        const newEnabledChains = new Set(state.enabledChains);
        if (chainName === 'osmosis') {
          // Don't allow disabling Osmosis
          newEnabledChains.add('osmosis');
        } else if (newEnabledChains.has(chainName)) {
          newEnabledChains.delete(chainName);
        } else {
          newEnabledChains.add(chainName);
        }
        return { enabledChains: newEnabledChains };
      }),
      toggleAll: (chains) => set((state) => {
        const allEnabled = chains.every(chain => state.enabledChains.has(chain));
        return { 
          enabledChains: new Set(allEnabled ? ['osmosis'] : chains) 
        };
      }),
      isChainEnabled: (chainName) => get().enabledChains.has(chainName),
    }),
    {
      name: 'chain-settings',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              enabledChains: new Set(state.enabledChains)
            }
          };
        },
        setItem: (name, value) => {
          const { state } = value;
          const serializedState = {
            state: {
              ...state,
              enabledChains: Array.from(state.enabledChains)
            }
          };
          localStorage.setItem(name, JSON.stringify(serializedState));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

export function useChainSettings() {
  const store = useChainSettingsStore();
  return {
    chains: registryChains,
    enabledChains: store.enabledChains,
    toggleChain: store.toggleChain,
    toggleAll: store.toggleAll,
    isChainEnabled: store.isChainEnabled,
  };
}