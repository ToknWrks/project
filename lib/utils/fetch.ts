import { logError } from '@/lib/error-handling';
import { FALLBACK_ENDPOINTS } from '@/lib/constants/endpoints';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const REQUEST_TIMEOUT = 15000; // 15 seconds

interface FetchOptions extends RequestInit {
  timeout?: number;
  validateResponse?: (response: Response) => Promise<boolean>;
}

export async function retryFetch(url: string, options: FetchOptions = {}): Promise<Response> {
  let lastError: Error | undefined;
  const timeout = options.timeout || REQUEST_TIMEOUT;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY * (attempt + 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Validate response
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid response type - expected JSON');
      }

      // Clone response for validation
      const clonedResponse = response.clone();
      
      try {
        // Try parsing response as JSON
        await clonedResponse.json();
      } catch (err) {
        throw new Error('Invalid JSON response');
      }

      // Custom validation if provided
      if (options.validateResponse) {
        const isValid = await options.validateResponse(response.clone());
        if (!isValid) {
          throw new Error('Response validation failed');
        }
      }

      return response;
    } catch (err) {
      lastError = err as Error;

      // Don't retry on abort
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('Request timed out - please try again');
      }

      // Log error but continue retrying
      logError(err, `Fetch attempt ${attempt + 1} failed`, true);

      // Try fallback endpoint if available
      const fallback = FALLBACK_ENDPOINTS[new URL(url).hostname];
      if (fallback && attempt === MAX_RETRIES - 1) {
        try {
          const fallbackResponse = await fetch(fallback.rest + new URL(url).pathname, {
            ...options,
            headers: {
              'Accept': 'application/json',
              ...options.headers
            }
          });
          return fallbackResponse;
        } catch (fallbackErr) {
          logError(fallbackErr, 'Fallback request failed', true);
        }
      }

      // Wait before retrying
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('Request failed after all retries');
}

// Helper to validate JSON response
export async function validateJsonResponse(response: Response): Promise<boolean> {
  try {
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return false;
    }
    await response.clone().json();
    return true;
  } catch {
    return false;
  }
}