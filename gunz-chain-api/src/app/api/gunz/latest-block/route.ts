// src/app/api/gunz/latest-block/route.ts
import { NextResponse } from "next/server";
import { getLatestBlockNumber, getBlock } from "@/lib/gunzClient";

export const runtime = "nodejs";

export async function GET() {
  try {
    const blockNumber = await getLatestBlockNumber();
    const block = await getBlock(blockNumber);

    return NextResponse.json({
      chainId: 43419,
      latestBlock: {
        number: blockNumber,
        hash: block?.hash,
        timestamp: block?.timestamp,
        txCount: block?.transactions.length ?? 0,
      },
    });
  } catch (err) {
    console.error("Error talking to GUNZ:", err);
    return new NextResponse("Failed to fetch GUNZ block", { status: 500 });
  }
}
