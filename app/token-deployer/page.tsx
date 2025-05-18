"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  ARTISTS_ACCOUNTS,
  PRICE_ENGINE_ADDRESS,
  TokenFactoryAddress,
} from "@/lib/constants";
import { lensMainnet } from "@/lib/web3-provider";
import { getContract, maxUint256 } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

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
    chainId: lensMainnet.id,
  });
  const publicClient = usePublicClient({
    chainId: lensMainnet.id,
  });

  const handleDeployToken = async () => {
    if (!walletClient || !publicClient || !walletClient.data?.account) return;

    const contract = getContract({
      address: TokenFactoryAddress,
      abi: TokenFactoryAbi,
      client: walletClient.data,
    });

    const txHash = await contract.write.createArtistToken(
      [
        "Doechii One Day",
        "DOECHII",
        maxUint256,
        PRICE_ENGINE_ADDRESS,
        ARTISTS_ACCOUNTS.DOECHII,
      ],
      {
        account: walletClient.data?.account,
        chain: lensMainnet,
      }
    );

    // const txHash = await walletClient.data?.writeContract({
    //   address: TokenFactoryAddress,
    //   abi: TokenFactoryAbi,
    //   functionName: "createArtistToken",
    //   args: [
    //     "Da Vinci One Day",
    //     "DAVINCI",
    //     BigInt(100000),
    //     PRICE_ENGINE_ADDRESS,
    //     ARTISTS_ACCOUNTS.DAVINCI,
    //   ],
    // });

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
