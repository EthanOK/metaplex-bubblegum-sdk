import "dotenv/config";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";

const GkvS_Private = process.env.GkvS_Private;

const HBdr_Private = process.env.HBdr_Private;

export const GkvS_Keypair = Keypair.fromSecretKey(bs58.decode(GkvS_Private));

export const HBdr_Keypair = Keypair.fromSecretKey(bs58.decode(HBdr_Private));
