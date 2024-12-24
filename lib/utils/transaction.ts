import { SigningStargateClient } from "@cosmjs/stargate";
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { logError } from '@/lib/error-handling';

const GAS_ADJUSTMENT = 1.3; // Add 30% buffer for gas estimation
const DEFAULT_GAS_PRICE = '0.025'; // Default gas price in smallest denomination

interface TransactionOptions {
  client: SigningStargateClient;
  address: string;
  messages: any[];
  chainName: string;
  memo?: string;
}

export async function broadcastTransaction({
  client,
  address,
  messages,
  chainName,
  memo = ''
}: TransactionOptions) {
  const chain = SUPPORTED_CHAINS[chainName];
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainName}`);
  }

  try {
    // Simulate transaction to estimate gas
    const gasEstimate = await client.simulate(address, messages, memo);
    
    // Add buffer to gas estimate
    const gasLimit = Math.ceil(gasEstimate * GAS_ADJUSTMENT);

    // Get gas price for chain
    const gasPriceAmount = DEFAULT_GAS_PRICE;
    const fee = {
      amount: [{ 
        amount: gasPriceAmount.replace(/[^0-9]/g, ''),
        denom: chain.denom 
      }],
      gas: gasLimit.toString()
    };

    // Execute transaction
    const tx = await client.signAndBroadcast(
      address,
      messages,
      fee,
      memo
    );

    if (tx.code !== 0) {
      throw new Error(tx.rawLog || 'Transaction failed');
    }

    return tx;
  } catch (err) {
    const message = logError(err, `Failed to broadcast transaction on ${chainName}`);
    throw new Error(message);
  }
}