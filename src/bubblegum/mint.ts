import {
  Keypair,
  keypairIdentity,
  none,
  PublicKey,
  RpcConfirmTransactionResult,
  TransactionSignature,
  RpcConfirmTransactionOptions,
} from "@metaplex-foundation/umi";
import {
  findLeafAssetIdPda,
  getAssetWithProof,
  LeafSchema,
  MetadataArgsArgs,
  mintV1,
  mplBubblegum,
  parseLeafFromMintV1Transaction,
  transfer,
} from "@metaplex-foundation/mpl-bubblegum";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";
import { Keypair as Web3JsKeypair } from "@solana/web3.js";
import bs58 from "bs58";

export const mintcNftNotCollection = async (
  endpoint: string,
  payer: Web3JsKeypair,
  to: PublicKey,
  merkleTree: PublicKey,
  name: string,
  symbol: string,
  uri: string
): Promise<PublicKey> => {
  const umi = createUmi(endpoint).use(mplBubblegum());
  umi.use(keypairIdentity(fromWeb3JsKeypair(payer), true));
  const { signature } = await mintV1(umi, {
    leafOwner: to,
    merkleTree: merkleTree,
    metadata: {
      name: name,
      symbol: symbol,
      uri: uri,
      sellerFeeBasisPoints: 500, // 5%
      collection: none(),
      creators: [
        { address: umi.identity.publicKey, verified: true, share: 100 },
      ],
    },
  }).sendAndConfirm(umi, { confirm: { commitment: "finalized" } });

  const leaf: LeafSchema = await parseLeafFromMintV1Transaction(umi, signature);

  const pda = findLeafAssetIdPda(umi, {
    merkleTree,
    leafIndex: leaf.nonce,
  });

  return pda[0];
};

export const getLeafBySignature = async (
  endpoint: string,
  signature: string,
  merkleTree: PublicKey
) => {
  const umi = createUmi(endpoint).use(mplBubblegum());

  const leaf: LeafSchema = await parseLeafFromMintV1Transaction(
    umi,
    bs58.decode(signature)
  );

  const assetId = findLeafAssetIdPda(umi, {
    merkleTree,
    leafIndex: leaf.nonce,
  });
  return assetId;
};

export const transferCNft = async (
  endpoint: string,
  payer: Web3JsKeypair,
  from: PublicKey,
  to: PublicKey,
  assetId: PublicKey
) => {
  const umi = createUmi(endpoint).use(mplBubblegum());
  umi.use(keypairIdentity(fromWeb3JsKeypair(payer), true));
  const assetWithProof = await getAssetWithProof(umi, assetId);

  const { signature } = await transfer(umi, {
    ...assetWithProof,
    leafOwner: from,
    newLeafOwner: to,
  }).sendAndConfirm(umi);
  return bs58.encode(signature);
};

export const getAssetWithProofByAssetId = async (
  endpoint: string,
  assetId: PublicKey
) => {
  const umi = createUmi(endpoint).use(mplBubblegum());
  const assetWithProof = await getAssetWithProof(umi, assetId);
  return assetWithProof;
};
