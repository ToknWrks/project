import axios from 'axios';
import { CHAIN_TO_COINGECKO_ID } from '@/lib/constants/coingecko';
import { logError } from '@/lib/error-handling';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const REQUEST_TIMEOUT = 5000;

export async function fetchTokenPrice(chainId: string): Promise<number> {
  const coingeckoId = CHAIN_TO_COINGECKO_ID[chainId];
  if (!coingeckoId) {
    console.warn(`No Coingecko ID mapping for chain: ${chainId}`);
    return 0;
  }

  try {
    const response = await axios.get(
      `${COINGECKO_API_URL}/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
      { timeout: REQUEST_TIMEOUT }
    );
    
    return response.data[coingeckoId]?.usd || 0;
  } catch (err) {
    logError(err, `Failed to fetch price for ${chainId}`, true);
    return 0;
  }
}