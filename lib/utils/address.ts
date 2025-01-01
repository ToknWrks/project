import { bech32 } from 'bech32';
import { chains } from 'chain-registry';

/**
 * Convert address to a different bech32 prefix
 */
export function convertAddress(address: string, toPrefix: string): string {
  try {
    const decoded = bech32.decode(address);
    return bech32.encode(toPrefix, decoded.words);
  } catch (err) {
    console.warn(`Failed to convert address to ${toPrefix}:`, err);
    return '';
  }
}

/**
 * Get chain-specific address from Osmosis address
 */
export function getAddressForChain(osmosisAddress: string | undefined, chainId: string): string {
  if (!osmosisAddress) return '';

  try {
    const chain = chains.find(c => c.chain_id === chainId);
    if (!chain) {
      console.warn(`Chain not found: ${chainId}`);
      return '';
    }

    // Get the prefix from the chain's bech32_prefix
    const prefix = chain.bech32_prefix;
    if (!prefix) {
      console.warn(`No bech32 prefix found for chain: ${chainId}`);
      return '';
    }

    return convertAddress(osmosisAddress, prefix);
  } catch (err) {
    console.warn(`Failed to get address for chain ${chainId}:`, err);
    return '';
  }
}