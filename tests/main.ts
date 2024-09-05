import { Connection, PublicKey } from "@solana/web3.js";
import { getAssetWithProofByAssetId } from "../src";
import { endpoint_dev, endpoint_main } from "./config";
import { publicKey } from "@metaplex-foundation/umi";

async function main() {
  const connection = new Connection(endpoint_dev);

  const accountInfo = await connection.getAccountInfo(
    new PublicKey("8mVoQaNytaE22KKygAQAZ8AwroKiR76BNydBqGW3CeEZ")
  );
  console.log(accountInfo);

  const proofs = await getAssetWithProofByAssetId(
    endpoint_main,
    publicKey("Cn6cf2km8GC5YHG4AweGp3NGs7EgyQc64L5RXVf4dPte")
  );
  console.log("AssetWithProof:", proofs.rpcAssetProof);
}

main();
