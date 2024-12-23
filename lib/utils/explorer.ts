/**
 * Get the explorer URL for a transaction
 */
export function getExplorerUrl(chainName: string, txHash: string): string {
  return chainName === 'osmosis'
    ? `https://www.mintscan.io/osmosis/tx/${txHash}`
    : `https://www.mintscan.io/${chainName}/tx/${txHash}`;
}