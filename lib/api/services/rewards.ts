import { SigningStargateClient } from "@cosmjs/stargate";
import { SUPPORTED_CHAINS } from "@/lib/constants/chains";
import { logError } from "@/lib/error-handling";
import { calculateClaimRewardsGas, getGasPrice } from "@/lib/utils/gas";
import { retryFetch, validateJsonResponse } from "@/lib/utils/fetch";

interface ClaimRewardsParams {
  chainName: string;
  address: string;
  validatorAddresses: string[];
  client: SigningStargateClient;
}

export async function claimChainRewards({
  chainName,
  address,
  validatorAddresses,
  client
}: ClaimRewardsParams) {
  if (!validatorAddresses.length) {
    throw new Error('No validators selected');
  }

  try {
    const chain = SUPPORTED_CHAINS[chainName as keyof typeof SUPPORTED_CHAINS];
    if (!chain) {
      throw new Error(`Unsupported chain: ${chainName}`);
    }

    // Validate rewards exist before claiming
    const rewardsResponse = await retryFetch(
      `${chain.rest}/cosmos/distribution/v1beta1/delegators/${address}/rewards`,
      {
        validateResponse: validateJsonResponse,
        timeout: 10000
      }
    );

    const rewardsData = await rewardsResponse.json();
    if (!rewardsData.rewards?.length) {
      throw new Error('No rewards available to claim');
    }

    // Create claim messages
    const messages = validatorAddresses.map(validatorAddress => ({
      typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
      value: {
        delegatorAddress: address,
        validatorAddress
      }
    }));

    // Calculate gas with chain-specific adjustments
    const gasLimit = calculateClaimRewardsGas(chainName, validatorAddresses.length);
    const gasPrice = getGasPrice(chainName);

    // Execute transaction
    const tx = await client.signAndBroadcast(
      address,
      messages,
      {
        amount: [{ 
          amount: (Number(gasPrice.match(/[\d.]+/)?.[0]) * gasLimit).toString(),
          denom: chain.denom 
        }],
        gas: gasLimit.toString()
      }
    );

    if (tx.code !== 0) {
      if (tx.rawLog?.includes('insufficient funds')) {
        throw new Error('Insufficient funds to pay for transaction fees');
      }
      if (tx.rawLog?.includes('out of gas')) {
        throw new Error('Transaction failed due to insufficient gas. Please try again.');
      }
      throw new Error(tx.rawLog || 'Failed to claim rewards');
    }

    return tx;
  } catch (err) {
    const message = logError(err, `Failed to claim ${chainName} rewards`);
    throw new Error(message);
  }
}