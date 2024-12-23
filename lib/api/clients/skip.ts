import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { logError } from '@/lib/error-handling';

const SKIP_API_URL = "https://api.skip.money/v2";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const REQUEST_TIMEOUT = 10000;

export class SkipApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string = SKIP_API_URL) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Accept': 'application/json'
      }
    });

    axiosRetry(this.client, {
      retries: MAX_RETRIES,
      retryDelay: (retryCount) => retryCount * RETRY_DELAY,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               (error.response?.status && error.response?.status >= 500);
      }
    });
  }

  async getTransactionHistory(params: {
    chainId: string;
    address: string;
    type: string;
    limit?: number;
  }) {
    try {
      const response = await this.client.get(`/cosmos/${params.chainId}/txs`, {
        params: {
          address: params.address,
          type: params.type,
          limit: params.limit || 100
        }
      });

      return response.data?.txs || [];
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  }

  async getHistoricalPrice(params: {
    chainId: string;
    denom: string;
    timestamp: string;
  }) {
    try {
      const response = await this.client.get(`/cosmos/${params.chainId}/price`, {
        params: {
          timestamp: params.timestamp,
          denom: params.denom
        }
      });

      return response.data?.price || 0;
    } catch (err) {
      logError(err, 'Failed to fetch historical price', true);
      return 0;
    }
  }
}

export const skipClient = new SkipApiClient();