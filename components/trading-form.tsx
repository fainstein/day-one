"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSessionStore } from "@/stores/session-store";
import { evmAddress } from "@lens-protocol/client";
import { Address, encodeFunctionData, formatUnits, parseUnits } from "viem";
import useArtist from "@/hooks/useArtist";
import { PRICE_ENGINE_ADDRESS } from "@/lib/constants";
import { useBalance, usePublicClient, useReadContract } from "wagmi";
import { lensMainnet } from "@/lib/web3-provider";
import { lensAccountAbi } from "@/lib/lens-account-abi";
import { artistTokenAbi } from "@/lib/artist-token-abi";
import { priceEngineAbi } from "@/lib/price-engine-abi";

type TradingFormProps = {
  artistAccountAddress: Address;
  tokenSymbol: string;
  price: number;
  userTokenBalance: bigint;
};

export default function TradingForm({
  artistAccountAddress,
  tokenSymbol,
  price,
  userTokenBalance,
}: TradingFormProps) {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { session, walletClient, accountAddress } = useSessionStore();
  const { artist } = useArtist(artistAccountAddress);
  const { data: balance } = useBalance({
    address: walletClient?.account?.address || "0x",
    chainId: lensMainnet.id,
  });
  const publicClient = usePublicClient({
    chainId: lensMainnet.id,
  });

  const { data: priceEngineBalance } = useBalance({
    address: PRICE_ENGINE_ADDRESS,
    chainId: lensMainnet.id,
  });

  console.log("priceEngineBalance", priceEngineBalance);

  const { data: tokenBalance } = useBalance({
    address: artist?.tokenAddress,
    chainId: lensMainnet.id,
  });

  console.log("tokenBalance", tokenBalance);

  const handleBuy = async () => {
    if (
      !amount ||
      Number.parseFloat(amount) <= 0 ||
      !session ||
      !walletClient ||
      !artist ||
      !walletClient?.account?.address
    ) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    const amountValue = Number.parseFloat(amount);

    const parsedAmount = parseUnits(amountValue.toFixed(18), 18);
    console.log("parsedAmount", parsedAmount);
    const requiredValue = parsedAmount;
    console.log("requiredValue", requiredValue);
    // const requiredValue = BigInt(artist.price || 0) * parsedAmount;

    setIsProcessing(true);

    try {
      const txHash = await walletClient.writeContract({
        address: accountAddress || "0x",
        abi: lensAccountAbi,
        functionName: "executeTransaction",
        chain: lensMainnet,
        account: walletClient?.account?.address,
        value: requiredValue,
        args: [
          evmAddress(artist.tokenAddress),
          requiredValue,
          encodeFunctionData({
            abi: artistTokenAbi,
            functionName: "mint",
            args: [accountAddress || "0x", parsedAmount],
          }),
        ],
      });

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: txHash,
      });

      console.log("RECEIPT:", receipt);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsProcessing(false);
    // await executeAccountAction(session, {
    //   account: evmAddress(artistAccountAddress),
    //   action: {
    //     unknown: {
    //       address: evmAddress(BUY_ARTIST_TOKEN_ACTION),
    //       params: [
    //         {
    //           data: blockchainData(artist.tokenAddress),
    //           key: blockchainData("lens.param.tokenAddress"),
    //         },
    //         {
    //           data: blockchainData(parsedAmount.toString()),
    //           key: blockchainData("lens.param.amount"),
    //         },
    //       ],
    //     },
    //   },
    // })
    //   .andThen(handleOperationWith(walletClient))
    //   .andThen(session.waitForTransaction)
    //   .andThen((txHash) => {
    //     console.log("TX HASH:", txHash);
    //     return fetchAccount(session, { txHash });
    //   });
  };

  const handleSell = async () => {
    if (
      !amount ||
      Number.parseFloat(amount) <= 0 ||
      !session ||
      !walletClient ||
      !artist ||
      !walletClient?.account?.address
    ) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    const amountValue = Number.parseFloat(amount);

    const parsedAmount = parseUnits(amountValue.toFixed(18), 18);
    console.log("parsedAmount", parsedAmount);
    const requiredValue = parsedAmount;
    console.log("requiredValue", requiredValue);
    // const requiredValue = BigInt(artist.price || 0) * parsedAmount;

    setIsProcessing(true);

    // const mintData = encodeFunctionData({
    //   abi: artistTokenAbi,
    //   functionName: "mint",
    //   args: [
    //     artist.accountAddress, // recipient
    //     parsedAmount,
    //   ],
    // });

    // const executeCalldata = encodeFunctionData({
    //   abi: lensAccountAbi,
    //   functionName: "executeTransaction",
    //   args: [
    //     artist.tokenAddress, // <-- the ERC20 contract
    //     0n, // no ETH out
    //     mintData,
    //   ],
    // });

    try {
      const txHash = await walletClient.writeContract({
        address: accountAddress || "0x",
        abi: lensAccountAbi,
        functionName: "executeTransaction",
        chain: lensMainnet,
        account: walletClient?.account?.address,
        value: BigInt(0),
        args: [
          evmAddress(artist.tokenAddress),
          BigInt(0),
          encodeFunctionData({
            abi: artistTokenAbi,
            functionName: "burn",
            args: [accountAddress || "0x", parsedAmount],
          }),
        ],
      });

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: txHash,
      });

      console.log("RECEIPT:", receipt);
      setIsProcessing(false);
    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
    }

    // await executeAccountAction(session, {
    //   account: evmAddress(artistAccountAddress),
    //   action: {
    //     unknown: {
    //       address: evmAddress(SELL_ARTIST_TOKEN_ACTION),
    //       params: [
    //         {
    //           data: blockchainData(artist.tokenAddress),
    //           key: blockchainData("lens.param.tokenAddress"),
    //         },
    //         {
    //           data: blockchainData(parsedAmount.toString()),
    //           key: blockchainData("lens.param.amount"),
    //         },
    //       ],
    //     },
    //   },
    // })
    //   .andThen(handleOperationWith(walletClient))
    //   .andThen(session.waitForTransaction)
    //   .andThen((txHash) => {
    //     console.log("TX HASH:", txHash);
    //     return fetchAccount(session, { txHash });
    //   });
  };

  const tokenAmount =
    amount && price !== 0 ? Number.parseFloat(amount) / price : 0;

  const handleBuyWithEOA = async () => {
    if (
      !amount ||
      Number.parseFloat(amount) <= 0 ||
      !walletClient ||
      !artist ||
      !walletClient?.account?.address
    ) {
      return;
    }

    const amountValue = Number.parseFloat(amount);

    const parsedAmount = parseUnits(amountValue.toFixed(18), 18);
    console.log("parsedAmount", parsedAmount);

    const txHash = await walletClient.writeContract({
      address: artist?.tokenAddress,
      abi: artistTokenAbi,
      functionName: "mint",
      chain: lensMainnet,
      account: walletClient?.account?.address,
      value: parsedAmount,
      args: [walletClient?.account?.address, parsedAmount],
    });

    const receipt = await publicClient?.waitForTransactionReceipt({
      hash: txHash,
    });

    console.log("RECEIPT:", receipt);
  };

  const handleSellWithEOA = async () => {
    if (
      !amount ||
      Number.parseFloat(amount) <= 0 ||
      !walletClient ||
      !artist ||
      !walletClient?.account?.address
    ) {
      return;
    }

    const amountValue = Number.parseFloat(amount);

    const parsedAmount = parseUnits(amountValue.toFixed(18), 18);
    console.log("parsedAmount", parsedAmount);

    const txHash = await walletClient.writeContract({
      address: artist?.tokenAddress,
      abi: artistTokenAbi,
      functionName: "burn",
      chain: lensMainnet,
      account: walletClient?.account?.address,
      args: [walletClient?.account?.address, parsedAmount],
    });

    const receipt = await publicClient?.waitForTransactionReceipt({
      hash: txHash,
    });

    console.log("RECEIPT:", receipt);
  };

  const equivalentGHO = artist?.price
    ? artist?.price * Number.parseFloat(amount || "0")
    : 0;

  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black/50">
      <CardHeader>
        <CardTitle>Trade ${tokenSymbol}</CardTitle>
        <CardDescription>Buy or sell artist tokens</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid grid-cols-2 bg-gray-100 dark:bg-gray-900">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Amount (${tokenSymbol})
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
              />

              <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                <span>You will spend:</span>
                <span className="font-mono">
                  {equivalentGHO.toFixed(2)} $GHO
                </span>
              </div>

              {balance && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Wallet Balance: {formatUnits(balance.value, balance.decimals)}{" "}
                  ${balance.symbol}
                </div>
              )}
            </div>

            <Button
              onClick={handleBuy}
              disabled={
                isProcessing || !amount || Number.parseFloat(amount) <= 0
              }
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              {isProcessing ? "Processing..." : "Buy Tokens"}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Amount (${tokenSymbol})
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
              />

              <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                <span>You will receive:</span>
                <span className="font-mono">
                  {equivalentGHO.toFixed(2)} $GHO
                </span>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-500">
                Token Balance:{" "}
                {Number(formatUnits(userTokenBalance, 18)).toFixed(2)} $
                {tokenSymbol}
              </div>
            </div>

            <Button
              onClick={handleSell}
              disabled={
                isProcessing || !amount || Number.parseFloat(amount) <= 0
              }
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              {isProcessing ? "Processing..." : "Sell Tokens"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
