// src/lib/gunzConfig.ts

export const GUNZ_CHAIN_ID = 43419;

export const DEFAULT_GUNZ_RPC_URL =
  "https://subnets.avax.network/gunzilla/mainnet/rpc";

export const GUNZ_RPC_URL =
  process.env.GUNZ_RPC_URL || DEFAULT_GUNZ_RPC_URL;
