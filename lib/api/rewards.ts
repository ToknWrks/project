import { SigningStargateClient } from "@cosmjs/stargate";
import { SUPPORTED_CHAINS } from "@/lib/constants/chains";
import { createClaimRewardsMessages } from "@/lib/messages/claim-rewards";
import { logError } from "@/lib/error-handling";

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

    // Create claim messages
    const messages = createClaimRewardsMessages({
      delegatorAddress: address,
      validatorAddresses
    });

    // Calculate gas estimate with buffer
    const gasEstimate = Math.ceil(150_000 * validatorAddresses.length);

    // Execute transaction
    const tx = await client.signAndBroadcast(
      address,
      messages,
      {
        amount: [{ amount: "5000", denom: chain.denom }],
        gas: gasEstimate.toString(),
      }
    );

    if (tx.code !== 0) {
      throw new Error(tx.rawLog || 'Failed to claim rewards');
    }

    return tx;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to claim rewards';
    throw new Error(logError(err, `Failed to claim ${chainName} rewards: ${errorMessage}`));
  }
}