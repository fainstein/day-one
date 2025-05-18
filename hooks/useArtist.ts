import { Artist } from "@/types/artist";
import useLensAccount from "./useLensAccount";
import { Address, erc20Abi, formatUnits, parseUnits } from "viem";
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { lensMainnet } from "@/lib/web3-provider";
import { priceEngineAbi } from "@/lib/price-engine-abi";
import { PRICE_ENGINE_ADDRESS } from "@/lib/constants";

export default function useArtist(accountAddress: Address): {
  artist: Artist | undefined;
  isLoading: boolean;
} {
  const { account } = useLensAccount(accountAddress, true);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient({
    chainId: lensMainnet.id,
  });
  const [extraData, setExtraData] = useState<{
    price: number;
    change24h: number;
    tokenSymbol: string;
    totalInvested: number;
    tokenAddress: Address;
    metrics: Artist["metrics"];
  }>();

  useEffect(() => {
    const fetchExtraData = async () => {
      if (!account || !account.metadata || !publicClient) return;
      setIsLoading(true);
      const tokenAddress = account.metadata.attributes.find(
        (attr) => attr.key === "token"
      )?.value as Address;
      console.log("tokenAddress", tokenAddress);
      if (!tokenAddress) return;

      const multicallResult = await publicClient.multicall({
        contracts: [
          {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "totalSupply",
          },
          {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "symbol",
          },
          {
            address: PRICE_ENGINE_ADDRESS,
            abi: priceEngineAbi,
            functionName: "getPrice",
            args: [accountAddress],
          },
          {
            address: PRICE_ENGINE_ADDRESS,
            abi: priceEngineAbi,
            functionName: "prevMetrics",
            args: [accountAddress],
          },
        ],
      });

      const totalSupply = multicallResult[0].result ?? BigInt(0);
      const tokenSymbol = (multicallResult[1].result as string) ?? "TKN";
      const price = multicallResult[2].result ?? BigInt(0);
      const metrics = multicallResult[3].result ?? BigInt(0);

      if (
        totalSupply === null ||
        tokenSymbol === null ||
        price === null ||
        metrics === null
      )
        return;

      const totalInvested = totalSupply * price;

      const totalInvestedInUnits =
        Number(formatUnits(totalSupply, 18)) * Number(formatUnits(price, 18));

      setExtraData({
        price: Number(formatUnits(price, 18)),
        change24h: Number(
          (
            Number(formatUnits(price, 18)) *
            (1 + (Math.random() * 0.1 - 0.05))
          ).toFixed(2)
        ), // Randomize +/- 5% of current price
        totalInvested: Number(totalInvestedInUnits),
        tokenAddress,
        tokenSymbol: tokenSymbol as string,
        metrics: {
          followers: {
            name: "Followers",
            value: Number(metrics),
            history: [],
            unit: "Followers",
            icon: "👥",
          },
        },
      });
      setIsLoading(false);
    };

    fetchExtraData();
  }, [account, accountAddress, publicClient]);

  if (
    !account ||
    !account.metadata ||
    !account.metadata.name ||
    !account.metadata.picture
  ) {
    return {
      artist: undefined,
      isLoading: false,
    };
  }

  const artist: Artist = {
    id: accountAddress,
    name: account.metadata.name,
    image: account.metadata.picture,
    tokenAddress: account.metadata.attributes.find(
      (attr) => attr.key === "token"
    )?.value as Address,
    tokenSymbol: extraData?.tokenSymbol ?? "TKN",
    price: extraData?.price,
    change24h: extraData?.change24h,
    totalInvested: extraData?.totalInvested,
    accountAddress: accountAddress,
    priceHistory: [],
    metrics: extraData?.metrics,
  };

  // TODO: 1. Add actions to the artist
  // TODO: 2. Create both tokens for doecci and da vinci (OK)
  // TODO: 3. Read treasury from price engine (TVL = Treasury - Released Liquidity)
  // TODO: 4. Add actions to doecci and da vinci
  // TODO: 5. Debug onchain data (like token) (OK)
  // TODO: 6. Fetch erc20 symbol from erc20 contract (OK)
  // TODO: 7. Change Price Logic - How token prices are calculated
  return {
    artist,
    isLoading,
  };
}
