import { bech32 } from 'bech32';
import { logError } from '@/lib/error-handling';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';

/**
 * Convert address between bech32 prefixes
 */
export function convertAddress(address: string, toPrefix: string): string {
  try {
    const decoded = bech32.decode(address);
    return bech32.encode(toPrefix, decoded.words);
  } catch (err) {
    logError(err, `Failed to convert address to ${toPrefix}`, true);
    return '';
  }
}

/**
 * Get chain-specific address from Cosmos Hub address
 */
export function getAddressForChain(cosmosAddress: string | undefined, chainId: string): string {
  if (!cosmosAddress) return '';

  try {
    // Get chain config
    const chain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === chainId);
    if (!chain) {
      throw new Error(`Unsupported chain: ${chainId}`);
    }

    // Extract prefix from chain ID
    const prefix = chainId === 'osmosis-1' ? 'osmo' :
                  chainId === 'cosmoshub-4' ? 'cosmos' :
                  chainId === 'akashnet-2' ? 'akash' :
                  chainId === 'juno-1' ? 'juno' :
                  chainId === 'celestia-1' ? 'celestia' :
                  chainId === 'regen-1' ? 'regen' : '';

    if (!prefix) {
      throw new Error(`No bech32 prefix found for chain: ${chainId}`);
    }

    // No conversion needed if address is already for target chain
    if (cosmosAddress.startsWith(prefix)) {
      return cosmosAddress;
    }

    return convertAddress(cosmosAddress, prefix);
  } catch (err) {
    logError(err, `Failed to get address for chain ${chainId}`, true);
    return '';
  }
}