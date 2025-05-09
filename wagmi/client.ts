import { PublicClient, testnet } from "@lens-protocol/react";
import { fragments } from "@/fragments";

export const client = PublicClient.create({
  environment: testnet,
  fragments,
});
