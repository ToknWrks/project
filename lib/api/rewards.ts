import { SigningStargateClient } from "@cosmjs/stargate";
import { SUPPORTED_CHAINS } from "@/lib/constants/chains";
import { createClaimRewardsMessages } from "@/lib/messages/claim-rewards";
import { logError } from "@/lib/error-handling";
import { calculateChainGas, calculateClaimRewardsGas, getGasPrice } from "@/lib/constants/gas";

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

    // Calculate chain-specific gas limit
    const baseGas = calculateClaimRewardsGas(validatorAddresses.length);
    const gasLimit = calculateChainGas(chainName, baseGas);

    // Get chain-specific gas price
    const gasPrice = getGasPrice(chainName);
    const gasPriceAmount = gasPrice.match(/[\d.]+/)?.[0] || '0.025';
    const gasPriceDenom = gasPrice.replace(/[\d.]+/, '') || chain.denom;

    // Execute transaction with calculated gas
    const tx = await client.signAndBroadcast(
      address,
      messages,
      {
        amount: [{ 
          amount: (Number(gasPriceAmount) * gasLimit).toString(),
          denom: gasPriceDenom
        }],
        gas: gasLimit.toString()
      }
    );

    if (tx.code !== 0) {
      if (tx.rawLog?.includes('insufficient funds')) {
        throw new Error('Insufficient funds to pay for transaction fees');
      }
      if (tx.rawLog?.includes('out of gas')) {
        throw new Error('Transaction failed due to insufficient gas. Please try again with higher gas.');
      }
      throw new Error(tx.rawLog || 'Failed to claim rewards');
    }

    return tx;
  } catch (err) {
    const message = logError(err, `Failed to claim ${chainName} rewards`);
    throw new Error(message);
  }
}