import axios from "axios";
import { format } from "date-fns";
import { SUPPORTED_CHAINS } from "@/lib/constants/chains";
import { logError } from "@/lib/error-handling";

const SKIP_API_URL = "https://api.skip.money/v2";
const TX_LIMIT = 50;

export interface ClaimEvent {
  amount: string;
  timestamp: string;
  validatorName: string;
  usdValue: string;
  txHash: string;
  chainName: string;
}

async function fetchHistoricalPrice(chainName: string, timestamp: string, denom: string) {
  try {
    const response = await axios.get(`${SKIP_API_URL}/cosmos/${chainName}/price`, {
      params: { timestamp, denom }
    });
    return response.data?.price || 0;
  } catch (err) {
    console.warn(`Failed to fetch historical price for ${chainName}:`, err);
    return 0;
  }
}

async function processTransaction(tx: any, chainName: string, chain: any): Promise<ClaimEvent | null> {
  try {
    const price = await fetchHistoricalPrice(chainName, tx.timestamp, chain.denom);
    
    const amount = tx.messages.reduce((sum: number, msg: any) => {
      if (msg.type === "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward") {
        const tokenAmount = msg.amounts?.find((a: any) => a.denom === chain.denom);
        return sum + (tokenAmount ? Number(tokenAmount.amount) : 0);
      }
      return sum;
    }, 0);

    const usdValue = (amount * price) / Math.pow(10, chain.decimals);

    return {
      amount: (amount / Math.pow(10, chain.decimals)).toFixed(6),
      timestamp: format(new Date(tx.timestamp), "MMM d, yyyy HH:mm"),
      validatorName: tx.validator?.moniker || "Unknown Validator",
      usdValue: usdValue.toFixed(2),
      txHash: tx.hash,
      chainName
    };
  } catch (err) {
    console.warn(`Error processing tx ${tx.hash}:`, err);
    return null;
  }
}

export async function fetchClaimHistory(address: string, chainName: string = 'osmosis'): Promise<{
  claims: ClaimEvent[];
  error?: string;
}> {
  try {
    const chain = SUPPORTED_CHAINS[chainName as keyof typeof SUPPORTED_CHAINS];
    if (!chain) {
      throw new Error(`Unsupported chain: ${chainName}`);
    }

    const response = await axios.get(`${SKIP_API_URL}/cosmos/${chainName}/txs`, {
      params: {
        address,
        type: "withdraw_delegator_reward",
        limit: TX_LIMIT
      }
    });

    if (!response.data?.txs?.length) {
      return { claims: [] };
    }

    const claims = await Promise.all(
      response.data.txs.map((tx: any) => processTransaction(tx, chainName, chain))
    );

    const validClaims = claims
      .filter((claim): claim is ClaimEvent => claim !== null)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return { claims: validClaims };

  } catch (err) {
    const error = logError(err, 'Fetching claim history');
    return { claims: [], error };
  }
}