import { assert, expect } from "chai";
import {
  createMerkleTree,
  getAsset,
  getAssetsByOwner,
  getAssetWithProofByAssetId,
  getLeafBySignature,
  getMerkleTreeConfigInfo,
  getMerkleTreeInfo,
  mintcNftNotCollection,
  transferCNft,
} from "../src/index";
import { PublicKey, publicKey } from "@metaplex-foundation/umi";
import { DasApiAssetList } from "@metaplex-foundation/digital-asset-standard-api";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { Base64 } from "js-base64";
import fs from "fs";
import { endpoint_dev, HBdr_Keypair } from "./config";

const merkleTree = "88cWPo35aiqRvnVYa8QRaCY64T83AET13dBy7vVMV3ew";

describe("Test SDK", () => {
  it("getAsset", async () => {
    const assetId = publicKey("8CjK4tU9NAwZKW6x5zboatkFaUBzutuWR8CYSDN3mjj4");
    const asset = await getAsset(endpoint_dev, assetId);
    console.log("asset Info:", asset);
  });

  it("getAssetsByOwner", async () => {
    const owner = publicKey("HBdrCWVcRGdn7oZD5YR6eYNW5A27VAczQcp2794gWvcV");
    const assets = await getAssetsByOwner(endpoint_dev, owner);
    assets.items.map((asset, indexed) => {
      if (asset.burnt) {
        console.log(" burnt:", indexed);
      }
      console.log(
        "asset name:",
        asset.content.metadata.name,
        "\nid:",
        asset.id,
        "is compressed:",
        asset.compression.compressed
      );
    });
  });

  it("createMerkleTree", async () => {
    return;
    const payerKeypair = JSON.parse(
      fs.readFileSync("/Users/ethan/.config/solana/id.json", "utf-8")
    );
    let res = await createMerkleTree(
      endpoint_dev,
      Keypair.fromSecretKey(new Uint8Array(payerKeypair))
    );
    console.log("signature:", bs58.encode(res.signature));
  });

  it("getMerkleTree", async () => {
    const merkleTreeInfo = await getMerkleTreeInfo(
      endpoint_dev,
      publicKey(merkleTree)
    );
    console.log(merkleTreeInfo);
  });

  it("getMerkleTreeConfig", async () => {
    const merkleTreeConfig = await getMerkleTreeConfigInfo(
      endpoint_dev,
      publicKey(merkleTree)
    );
    // console.log(merkleTreeConfig);
  });

  it("mint cNft Not Collection", async () => {
    return;
    const to = publicKey("HBdrCWVcRGdn7oZD5YR6eYNW5A27VAczQcp2794gWvcV");

    const tokenId = Math.floor(Math.random() * 3000);

    const payerKeypair = JSON.parse(
      fs.readFileSync("/Users/ethan/.config/solana/id.json", "utf-8")
    );

    const assetId = await mintcNftNotCollection(
      endpoint_dev,
      Keypair.fromSecretKey(new Uint8Array(payerKeypair)),
      to,
      publicKey(merkleTree),
      "SoMon OwOG #" + tokenId,
      "OWOG",
      "https://ipfs.opensocial.co/ipfs/QmNfdkqWkAcvjdrJ3gqg1q8ZEDka9tPeefr3e2TE4wSYuW/metadata/" +
        tokenId +
        ".json"
    );

    console.log("assetId:", assetId);
  });

  it("getLeafBySignature", async () => {
    const leaf = await getLeafBySignature(
      endpoint_dev,
      "ti6tgQNtJ5wobpzaW4iYBYFcYxm8MSkFPErPhMKHczQdMVY9pcG23bgN4yi6vNZht9y8ioRz8oitiUw9JTyH7fF",
      publicKey(merkleTree)
    );

    assert.equal(
      leaf[0].toString(),
      "F4dwZjK7AHqRiGMY8qLqzKWk4QJrkBB6zwkhs2TV8C1X"
    );
  });

  it("transfer CNft", async () => {
    return;
    const from = publicKey("HBdrCWVcRGdn7oZD5YR6eYNW5A27VAczQcp2794gWvcV");
    const to = publicKey("GkvSQVVJemmah9YGNj127mSjPbh4ekmt48QQ6t4zRDVV");
    const assetId = publicKey("5rW4GPzXFwXLUZXLZY6xQ964cdV44ct8Bi8pj6ia3ykc");

    const signature = await transferCNft(
      endpoint_dev,
      HBdr_Keypair,
      from,
      to,
      assetId
    );
    console.log("signature:", signature);
  });

  it("getAssetWithProof", async () => {
    const proofs = await getAssetWithProofByAssetId(
      endpoint_dev,
      publicKey("5rW4GPzXFwXLUZXLZY6xQ964cdV44ct8Bi8pj6ia3ykc")
    );
    console.log("AssetWithProof:", proofs.rpcAssetProof);
    console.log("root:", Base64.fromUint8Array(proofs.root));
    console.log("dataHash:", Base64.fromUint8Array(proofs.dataHash));
    console.log("creatorHash:", Base64.fromUint8Array(proofs.creatorHash));
  });
});
