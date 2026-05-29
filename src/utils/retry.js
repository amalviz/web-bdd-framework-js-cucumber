import { logger } from './logger.js';

export const SELENIUM_RETRYABLE_ERRORS = [
  'StaleElementReferenceError',
  'ElementClickInterceptedError',
  'ElementNotInteractableError',
  'TimeoutError',
];

const isRetryableError = (error, retryableErrors) => {
  const errorName = error.name || error.constructor?.name;
  return retryableErrors.includes(errorName);
};

/**
 * Retries an async function with a fixed delay between attempts.
 */
export async function withRetry(fn, options = {}) {
  const {
    maxAttempts = 3,
    delayMs = 500,
    label = 'action',
    retryableErrors = SELENIUM_RETRYABLE_ERRORS,
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const shouldRetry =
        attempt < maxAttempts && isRetryableError(error, retryableErrors);

      if (!shouldRetry) {
        throw error;
      }

      logger.warn(
        `${label} failed (attempt ${attempt}/${maxAttempts}): ${error.message}. Retrying in ${delayMs}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
