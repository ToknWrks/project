import { assets } from 'chain-registry';
import { logError } from '@/lib/error-handling';
import { Token } from '@/lib/constants/tokens';

export interface AssetList {
  chain_name: string;
  assets: Token[];
}

export async function getChainAssets(chainName: string): Promise<Token[]> {
  try {
    const chainAssets = assets.find(
      (asset) => asset.chain_name === chainName
    );

    if (!chainAssets?.assets) {
      throw new Error(`No assets found for ${chainName}`);
    }

    return chainAssets.assets.map(asset => ({
      denom: asset.base,
      symbol: asset.symbol?.toUpperCase() || '',
      name: asset.name,
      logo: asset.logo_URIs?.png || asset.logo_URIs?.svg,
      decimals: asset.denom_units?.find(unit => unit.denom === asset.symbol)?.exponent || 6
    }));
  } catch (err) {
    logError(err, `Failed to get assets for ${chainName}`);
    return [];
  }
}

export async function getIBCTokens(chainName: string): Promise<Token[]> {
  try {
    const chainAssets = assets.find(
      (asset) => asset.chain_name === chainName
    );

    if (!chainAssets?.assets) {
      return [];
    }

    return chainAssets.assets
      .filter(asset => asset.type_asset === 'ics20')
      .map(asset => ({
        denom: asset.base,
        symbol: asset.symbol?.toUpperCase() || '',
        name: asset.name,
        logo: asset.logo_URIs?.png || asset.logo_URIs?.svg,
        decimals: asset.denom_units?.find(unit => unit.denom === asset.symbol)?.exponent || 6,
        traces: asset.traces
      }));
  } catch (err) {
    logError(err, `Failed to get IBC tokens for ${chainName}`);
    return [];
  }
}