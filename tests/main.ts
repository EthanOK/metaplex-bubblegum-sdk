import { Connection, PublicKey } from "@solana/web3.js";

async function main() {
  const endpoint = "https://api.devnet.solana.com";
  const connection = new Connection(endpoint);

  const accountInfo = await connection.getAccountInfo(
    new PublicKey("8mVoQaNytaE22KKygAQAZ8AwroKiR76BNydBqGW3CeEZ")
  );
  console.log(accountInfo);
}

main();
