```typescript
/**
 * Validate a bech32 address
 */
export function isValidAddress(address: string): boolean {
  try {
    if (!address) return false;
    if (!/^[a-z0-9]+$/.test(address)) return false;
    if (address.length < 39 || address.length > 59) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate a transaction hash
 */
export function isValidTxHash(hash: string): boolean {
  try {
    if (!hash) return false;
    if (!/^[A-F0-9]+$/i.test(hash)) return false;
    if (hash.length !== 64) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate an amount
 */
export function isValidAmount(amount: string | number): boolean {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(num) && num > 0;
}
```