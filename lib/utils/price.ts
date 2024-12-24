import { CHAIN_TO_COINGECKO_ID } from '@/lib/constants/coingecko';
import { logError } from '@/lib/error-handling';
import axios from 'axios';

const PRICE_CACHE: { [key: string]: { price: number; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getTokenPrice(chainName: string): Promise<number> {
  try {
    // Check cache first
    const cached = PRICE_CACHE[chainName];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.price;
    }

    const coingeckoId = CHAIN_TO_COINGECKO_ID[chainName];
    if (!coingeckoId) {
      console.warn(`No Coingecko ID mapping for chain: ${chainName}`);
      return 0;
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
      { timeout: 5000 }
    );

    const price = response.data[coingeckoId]?.usd || 0;

    // Cache the result
    PRICE_CACHE[chainName] = {
      price,
      timestamp: Date.now()
    };

    return price;
  } catch (err) {
    logError(err, `Failed to fetch price for ${chainName}`, true);
    return PRICE_CACHE[chainName]?.price || 0;
  }
}

export function formatUsdValue(amount: number | string, price: number): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(value)) return '$0.00';
  return `$${(value * price).toFixed(2)}`;
}