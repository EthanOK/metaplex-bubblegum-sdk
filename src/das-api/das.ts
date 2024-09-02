import { PublicKey, publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  dasApi,
  DasApiAsset,
  DasApiAssetList,
} from "@metaplex-foundation/digital-asset-standard-api";
import { das } from "@metaplex-foundation/mpl-core-das";

/**
 * getAsset
 * @param endpoint
 * @param assetId
 */
export const getAsset = async (
  endpoint: string,
  assetId: PublicKey
): Promise<DasApiAsset> => {
  const umi = createUmi(endpoint).use(dasApi());
  const asset: DasApiAsset = await umi.rpc.getAsset(assetId);

  return asset;
};

export const getAssetsByOwner = async (
  endpoint: string,
  owner: PublicKey
): Promise<DasApiAssetList> => {
  const umi = createUmi(endpoint).use(dasApi());
  const assets = await umi.rpc.getAssetsByOwner({ owner });
  return assets;
};

export const aaa = "";
