import { format } from "date-fns";
import { SUPPORTED_CHAINS } from "@/lib/constants/chains";
import { skipClient } from "../clients/skip";
import { logError } from "@/lib/error-handling";
import { formatNumber } from "@/lib/utils/format";

export interface ClaimEvent {
  amount: string;
  timestamp: string;
  validatorName: string;
  usdValue: string;
  txHash: string;
  chainName: string;
}

export async function fetchClaimHistory(address: string, chainName: string): Promise<{
  claims: ClaimEvent[];
  error?: string;
}> {
  if (!address) {
    return { claims: [], error: "No address provided" };
  }

  try {
    const chain = SUPPORTED_CHAINS[chainName as keyof typeof SUPPORTED_CHAINS];
    if (!chain) {
      return { claims: [], error: `Unsupported chain: ${chainName}` };
    }

    // Fetch withdraw reward transactions
    const transactions = await skipClient.getTransactionHistory({
      chainId: chain.chainId,
      address,
      type: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward"
    });

    if (!transactions?.length) {
      return { claims: [] };
    }

    // Process transactions
    const claims = await Promise.all(
      transactions.map(async (tx: any) => {
        try {
          // Extract reward amount from messages
          const amount = tx.messages.reduce((sum: number, msg: any) => {
            if (msg.type === "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward") {
              const tokenAmount = msg.amounts?.find((a: any) => a.denom === chain.denom);
              return sum + (tokenAmount ? Number(tokenAmount.amount) : 0);
            }
            return sum;
          }, 0);

          if (amount <= 0) return null;

          // Get historical price
          const price = await skipClient.getHistoricalPrice({
            chainId: chain.chainId,
            denom: chain.denom,
            timestamp: tx.timestamp
          });

          // Calculate USD value
          const numericAmount = amount / Math.pow(10, chain.decimals);
          const usdValue = numericAmount * price;

          return {
            amount: formatNumber(numericAmount, 6),
            timestamp: format(new Date(tx.timestamp), "MMM d, yyyy HH:mm"),
            validatorName: tx.validator?.moniker || "Unknown Validator",
            usdValue: formatNumber(usdValue, 2),
            txHash: tx.hash,
            chainName
          };
        } catch (err) {
          logError(err, `Error processing transaction ${tx.hash}`, true);
          return null;
        }
      })
    );

    // Filter out failed processing and sort by timestamp
    return {
      claims: claims
        .filter((claim): claim is ClaimEvent => claim !== null)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    };

  } catch (err) {
    const error = logError(err, 'Fetching claim history');
    return { 
      claims: [],
      error: error === "Request failed with status code 404" 
        ? "No claims history found" 
        : `Failed to fetch claims history: ${error}`
    };
  }
}