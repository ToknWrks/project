"use client";

/**
 * Format a number with specified decimals
 */
export function formatNumber(value: string | number, decimals: number = 6): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return num.toFixed(decimals);
}

/**
 * Format a number as USD currency
 */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format a token amount with symbol
 */
export function formatTokenAmount(
  amount: string | number,
  symbol: string,
  decimals: number = 6
): string {
  return `${formatNumber(amount, decimals)} ${symbol}`;
}