import { rateLimiter } from './rate-limiter';
import { logError } from '@/lib/error-handling';

const RETRY_COUNT = 3;
const RETRY_DELAY = 1000;
const TIMEOUT = 10000;

export async function retryFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let lastError;

  for (let i = 0; i < RETRY_COUNT; i++) {
    try {
      // Apply rate limiting before making request
      await rateLimiter.throttle(new URL(url).hostname);

      // Set up timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      // Handle rate limiting response
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY * (i + 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Validate response status
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Validate content type
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error(`Invalid response type: expected JSON, got ${contentType}`);
      }

      return response;
    } catch (err) {
      lastError = err;
      
      // Don't retry on abort
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw err;
      }

      // Wait before retrying
      if (i < RETRY_COUNT - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
      }
    }
  }

  throw lastError;
}