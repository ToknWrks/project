import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { logError } from '@/lib/error-handling';
import { retryFetch } from '@/lib/utils/fetch';

export interface ChainBalance {
  available: string;
  staked: string;
  rewards: string;
  usdValues: {
    available: string;
    staked: string;
    rewards: string;
    total: string;
  };
}

export async function fetchChainBalances(
  address: string, 
  chainName: string,
  price: number
): Promise<ChainBalance | null> {
  const chain = SUPPORTED_CHAINS[chainName];
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainName}`);
  }

  try {
    // Fetch all balances in parallel
    const [available, staked, rewards] = await Promise.all([
      fetchAvailableBalance(chain.rest, address, chain.denom, chain.decimals),
      fetchStakedBalance(chain.rest, address, chain.decimals),
      fetchRewards(chain.rest, address, chain.denom, chain.decimals)
    ]);

    // Calculate USD values
    const availableUsd = (Number(available) * price).toFixed(2);
    const stakedUsd = (Number(staked) * price).toFixed(2);
    const rewardsUsd = (Number(rewards) * price).toFixed(2);
    const totalUsd = (
      Number(available) * price + 
      Number(staked) * price + 
      Number(rewards) * price
    ).toFixed(2);

    return {
      available,
      staked,
      rewards,
      usdValues: {
        available: availableUsd,
        staked: stakedUsd,
        rewards: rewardsUsd,
        total: totalUsd
      }
    };
  } catch (err) {
    logError(err, `Failed to fetch ${chainName} balances`, true);
    return null;
  }
}

async function fetchAvailableBalance(
  restUrl: string,
  address: string,
  denom: string,
  decimals: number = 6
): Promise<string> {
  try {
    const response = await retryFetch(
      `${restUrl}/cosmos/bank/v1beta1/balances/${address}`
    );
    const data = await response.json();
    
    const balance = data.balances?.find((b: any) => b.denom === denom);
    return balance ? (Number(balance.amount) / Math.pow(10, decimals)).toFixed(decimals) : "0";
  } catch (err) {
    logError(err, 'Fetching available balance', true);
    return "0";
  }
}

async function fetchStakedBalance(
  restUrl: string,
  address: string,
  decimals: number = 6
): Promise<string> {
  try {
    const response = await retryFetch(
      `${restUrl}/cosmos/staking/v1beta1/delegations/${address}`
    );
    const data = await response.json();
    
    const total = data.delegation_responses?.reduce(
      (sum: number, del: any) => sum + Number(del.balance.amount),
      0
    ) || 0;

    return (total / Math.pow(10, decimals)).toFixed(decimals);
  } catch (err) {
    logError(err, 'Fetching staked balance', true);
    return "0";
  }
}

async function fetchRewards(
  restUrl: string,
  address: string,
  denom: string,
  decimals: number = 6
): Promise<string> {
  try {
    const response = await retryFetch(
      `${restUrl}/cosmos/distribution/v1beta1/delegators/${address}/rewards`
    );
    const data = await response.json();
    
    const rewards = data.total?.find((r: any) => r.denom === denom);
    return rewards ? (Number(rewards.amount) / Math.pow(10, decimals)).toFixed(decimals) : "0";
  } catch (err) {
    logError(err, 'Fetching rewards', true);
    return "0";
  }
}