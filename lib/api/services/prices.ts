import axios from 'axios';
import axiosRetry from 'axios-retry';
import { CHAIN_TO_COINGECKO_ID, FALLBACK_PRICES } from '@/lib/constants/coingecko';
import { logError } from '@/lib/error-handling';
import { getInternalChainName } from '@/lib/utils/chain';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const REQUEST_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds between retries

// Create axios instance with retry configuration
const axiosInstance = axios.create({ 
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Accept': 'application/json',
    'Accept-Encoding': 'deflate, gzip'
  }
});

// Configure retry behavior
axiosRetry(axiosInstance, {
  retries: MAX_RETRIES,
  retryDelay: (retryCount) => retryCount * RETRY_DELAY,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.code === 'ECONNABORTED' ||
           (error.response?.status === 429) ||
           (error.response?.status >= 500);
  }
});

// Price cache with 5 minute expiry
const PRICE_CACHE = new Map<string, { price: number; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

export async function fetchTokenPrice(chainName: string): Promise<number> {
  try {
    // Convert to internal chain name
    const internalChainName = getInternalChainName(chainName);
    
    // Check cache first
    const cached = PRICE_CACHE.get(internalChainName);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.price;
    }

    // Get CoinGecko ID
    const coingeckoId = CHAIN_TO_COINGECKO_ID[internalChainName];
    if (!coingeckoId) {
      console.warn(`No Coingecko ID mapping for chain: ${internalChainName}`);
      return FALLBACK_PRICES[internalChainName] || 0;
    }

    // Fetch price with retries
    const response = await axiosInstance.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: coingeckoId,
        vs_currencies: 'usd'
      }
    });

    const price = response.data[coingeckoId]?.usd || 0;

    // Cache the result
    PRICE_CACHE.set(internalChainName, {
      price,
      timestamp: Date.now()
    });

    return price;
  } catch (err) {
    logError(err, `Failed to fetch price for ${chainName}`, true);
    
    // Try cached price even if expired
    const cached = PRICE_CACHE.get(chainName);
    if (cached) {
      return cached.price;
    }

    // Return fallback price
    return FALLBACK_PRICES[chainName] || 0;
  }
}