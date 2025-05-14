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
import useLensAccount from "@/hooks/useLensAccount";
import { blockchainData, evmAddress } from "@lens-protocol/client";
import {
  executeAccountAction,
  fetchAccount,
} from "@lens-protocol/client/actions";
import { Address, parseUnits, toBytes } from "viem";
import { handleOperationWith } from "@lens-protocol/client/viem";
import {
  BUY_TOKEN_ACTION_ADDRESS,
  SELL_TOKEN_ACTION_ADDRESS,
} from "@/app/admin/[artistAccountAddress]/page";

type TradingFormProps = {
  artistAccountAddress: Address;
  tokenSymbol: string;
  price: number;
  userTokenBalance: number;
};

// TODO: Implement balance from Lens
export const BALANCE_MOCK = 1000;
const balance = BALANCE_MOCK;

export default function TradingForm({
  artistAccountAddress,
  tokenSymbol,
  price,
  userTokenBalance,
}: TradingFormProps) {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { session, walletClient } = useSessionStore();

  const handleBuy = async () => {
    if (
      !amount ||
      Number.parseFloat(amount) <= 0 ||
      !session ||
      !walletClient
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

    setIsProcessing(true);

    await executeAccountAction(session, {
      account: evmAddress(artistAccountAddress),
      action: {
        unknown: {
          address: evmAddress(BUY_TOKEN_ACTION_ADDRESS),
          params: [
            {
              data: blockchainData(parsedAmount.toString()),
              key: blockchainData("lens.param.amount"),
            },
          ],
        },
      },
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(session.waitForTransaction)
      .andThen((txHash) => {
        console.log("TX HASH:", txHash);
        return fetchAccount(session, { txHash });
      });
  };
  const handleSell = async () => {
    if (
      !amount ||
      Number.parseFloat(amount) <= 0 ||
      !session ||
      !walletClient
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

    setIsProcessing(true);

    await executeAccountAction(session, {
      account: evmAddress(artistAccountAddress),
      action: {
        unknown: {
          address: evmAddress(SELL_TOKEN_ACTION_ADDRESS),
          params: [
            {
              data: blockchainData(parsedAmount.toString()),
              key: blockchainData("lens.param.amount"),
            },
          ],
        },
      },
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(session.waitForTransaction)
      .andThen((txHash) => {
        console.log("TX HASH:", txHash);
        return fetchAccount(session, { txHash });
      });
  };

  const tokenAmount = amount ? Number.parseFloat(amount) / price : 0;

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
                Amount ($GHO)
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
                  {tokenAmount.toFixed(4)} ${tokenSymbol}
                </span>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-500">
                Wallet Balance: {balance.toFixed(2)} $GHO
              </div>
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
                Amount ($GHO)
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
              />

              <div className="text-sm text-gray-600 dark:text-gray-400 flex justify-between">
                <span>You will sell:</span>
                <span className="font-mono">
                  {tokenAmount.toFixed(4)} ${tokenSymbol}
                </span>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-500">
                Token Balance: {userTokenBalance.toFixed(4)} ${tokenSymbol}
              </div>
            </div>

            <Button
              onClick={handleSell}
              disabled={
                isProcessing ||
                !amount ||
                Number.parseFloat(amount) <= 0 ||
                tokenAmount > userTokenBalance
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
