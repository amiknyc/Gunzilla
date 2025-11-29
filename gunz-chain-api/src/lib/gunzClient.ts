// src/lib/gunzClient.ts
import { JsonRpcProvider } from "ethers";
import { GUNZ_CHAIN_ID, GUNZ_RPC_URL } from "./gunzConfig";

export const gunzProvider = new JsonRpcProvider(GUNZ_RPC_URL, GUNZ_CHAIN_ID);

export async function getLatestBlockNumber(): Promise<number> {
  return await gunzProvider.getBlockNumber();
}

export async function getBlock(blockNumber: number) {
  return await gunzProvider.getBlock(blockNumber);
}
