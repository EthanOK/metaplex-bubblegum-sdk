import {
  generateSigner,
  signerIdentity,
  signerPayer,
  createSignerFromKeypair,
  keypairIdentity,
  keypairPayer,
  TransactionSignature,
  RpcConfirmTransactionResult,
  PublicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createTree,
  fetchMerkleTree,
  fetchTreeConfig,
  fetchTreeConfigFromSeeds,
  MerkleTree,
  mplBubblegum,
  TreeConfig,
} from "@metaplex-foundation/mpl-bubblegum";
import { Keypair } from "@solana/web3.js";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";

export const createMerkleTree = async (
  endpoint: string,
  payer: Keypair
): Promise<{
  signature: TransactionSignature;
  result: RpcConfirmTransactionResult;
}> => {
  const umi = createUmi(endpoint).use(mplBubblegum());

  umi.use(keypairIdentity(fromWeb3JsKeypair(payer), true));
  const merkleTree = generateSigner(umi);

  const builder = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    maxBufferSize: 64,
  });

  const result = await builder.sendAndConfirm(umi);
  return result;
};

export const getMerkleTreeInfo = async (
  endpoint: string,
  merkleTree: PublicKey
): Promise<MerkleTree> => {
  const umi = createUmi(endpoint).use(mplBubblegum());

  let result = await fetchMerkleTree(umi, merkleTree);
  return result;
};

export const getMerkleTreeConfigInfo = async (
  endpoint: string,
  merkleTree: PublicKey
): Promise<TreeConfig> => {
  const umi = createUmi(endpoint).use(mplBubblegum());

  let result = await fetchTreeConfigFromSeeds(umi, { merkleTree: merkleTree });
  return result;
};
