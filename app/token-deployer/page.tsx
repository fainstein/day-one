"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ARTISTS_ACCOUNTS, PRICE_ENGINE_ADDRESS } from "@/lib/constants";
import { lensSepolia } from "@/lib/web3-provider";
import { usePublicClient, useWalletClient } from "wagmi";

const TokenFactoryAddress = "0xC2211c8A2ca301EE7ed5e11873A6A88ff7848066";
const TokenFactoryAbi = [
  {
    name: "createArtistToken",
    type: "function",
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "maxSupply", type: "uint256" },
      { name: "priceEngine", type: "address" },
      { name: "artist", type: "address" },
    ],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    name: "artistToToken",
    type: "function",
    inputs: [{ name: "artist", type: "address" }],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    name: "TokenCreated",
    type: "event",
    inputs: [
      { name: "artist", type: "address", indexed: true },
      { name: "token", type: "address", indexed: true },
    ],
    anonymous: false,
  },
] as const;

export default function TokenDeployerPage() {
  const walletClient = useWalletClient({
    chainId: lensSepolia.id,
  });
  const publicClient = usePublicClient({
    chainId: lensSepolia.id,
  });

  const handleDeployToken = async () => {
    if (!walletClient || !publicClient) return;

    const txHash = await walletClient.data?.writeContract({
      address: TokenFactoryAddress,
      abi: TokenFactoryAbi,
      functionName: "createArtistToken",
      args: [
        "Da Vinci One Day",
        "DAVINCI",
        BigInt(100000),
        PRICE_ENGINE_ADDRESS,
        ARTISTS_ACCOUNTS.DAVINCI,
      ],
    });

    if (!txHash) {
      toast({
        title: "Error",
        description: "Failed to deploy token",
      });
      return;
    }
    console.log("txHash", txHash);
    const result = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });
    console.log("result", result);
    if (result.status === "success") {
      toast({
        title: "Token deployed",
        description: "Token deployed successfully",
      });
    }
  };

  return (
    <div>
      <Button onClick={handleDeployToken}>Deploy Token</Button>
    </div>
  );
}
