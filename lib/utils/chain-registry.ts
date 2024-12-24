import { Chain } from '@chain-registry/types';
import { chains, assets } from 'chain-registry';
import { FALLBACK_ENDPOINTS } from '@/lib/constants/endpoints';

// Get mainnet chains from registry
export function getMainnetChains(): Chain[] {
  return chains.filter(chain => 
    chain.network_type === 'mainnet' &&
    chain.status === 'live' &&
    chain.chain_name &&
    chain.apis?.rest?.length > 0 &&
    chain.apis?.rpc?.length > 0
  );
}

// Get chain endpoints
export function getChainEndpoints(chain: Chain) {
  // Check fallback endpoints first
  const fallback = FALLBACK_ENDPOINTS[chain.chain_name];
  if (fallback) {
    return fallback;
  }

  // Get secure endpoints from chain
  const restEndpoint = chain.apis?.rest?.find(rest => 
    rest.address.startsWith('https') && 
    !rest.address.includes('localhost')
  )?.address;

  const rpcEndpoint = chain.apis?.rpc?.find(rpc => 
    rpc.address.startsWith('https') && 
    !rpc.address.includes('localhost')
  )?.address;

  if (!restEndpoint || !rpcEndpoint) {
    return null;
  }

  return {
    rest: restEndpoint,
    rpc: rpcEndpoint
  };
}

// Get chain assets
export function getChainAsset(chainName: string) {
  const chainAssets = assets.find(asset => asset.chain_name === chainName);
  if (!chainAssets?.assets.length) return null;

  const mainAsset = chainAssets.assets[0];
  return {
    denom: mainAsset.base,
    symbol: mainAsset.symbol?.toUpperCase() || '',
    name: mainAsset.name,
    decimals: mainAsset.denom_units?.find(unit => unit.denom === mainAsset.symbol)?.exponent || 6,
    logo: mainAsset.logo_URIs?.png || mainAsset.logo_URIs?.svg
  };
}

// Get chain info
export function getChainInfo(chain: Chain) {
  const endpoints = getChainEndpoints(chain);
  if (!endpoints) return null;

  const asset = getChainAsset(chain.chain_name);
  if (!asset) return null;

  return {
    name: chain.pretty_name || chain.chain_name,
    chainId: chain.chain_id,
    denom: asset.denom,
    symbol: asset.symbol,
    decimals: asset.decimals,
    icon: asset.logo,
    rest: endpoints.rest,
    rpc: endpoints.rpc,
    unbondingDays: chain.staking?.unbonding_time ? 
      Math.ceil(parseInt(chain.staking.unbonding_time) / (24 * 60 * 60)) : 
      14
  };
}