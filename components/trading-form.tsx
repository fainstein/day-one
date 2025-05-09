"use client"

import { useState } from "react"
import { useMockData } from "@/lib/mock-data-provider"
import { useWallet } from "@/lib/wallet-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

type TradingFormProps = {
  artistId: string
  tokenSymbol: string
  price: number
  userTokenBalance: number
}

export default function TradingForm({ artistId, tokenSymbol, price, userTokenBalance }: TradingFormProps) {
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { buyTokens, sellTokens } = useMockData()
  const { balance } = useWallet()
  const { toast } = useToast()

  const handleBuy = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      })
      return
    }

    const amountValue = Number.parseFloat(amount)

    setIsProcessing(true)

    setTimeout(() => {
      const success = buyTokens(artistId, amountValue)

      if (success) {
        toast({
          title: "Purchase Successful",
          description: `You bought ${(amountValue / price).toFixed(4)} $${tokenSymbol} tokens.`,
        })
        setAmount("")
      } else {
        toast({
          title: "Purchase Failed",
          description: "There was an error processing your purchase.",
          variant: "destructive",
        })
      }

      setIsProcessing(false)
    }, 1500)
  }

  const handleSell = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      })
      return
    }

    const amountValue = Number.parseFloat(amount)
    const tokenAmount = amountValue / price

    if (tokenAmount > userTokenBalance) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${userTokenBalance.toFixed(4)} $${tokenSymbol} tokens.`,
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      const success = sellTokens(artistId, amountValue)

      if (success) {
        toast({
          title: "Sale Successful",
          description: `You sold ${(amountValue / price).toFixed(4)} $${tokenSymbol} tokens.`,
        })
        setAmount("")
      } else {
        toast({
          title: "Sale Failed",
          description: "There was an error processing your sale.",
          variant: "destructive",
        })
      }

      setIsProcessing(false)
    }, 1500)
  }

  const tokenAmount = amount ? Number.parseFloat(amount) / price : 0

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
              <label className="text-sm text-gray-600 dark:text-gray-400">Amount (USDC)</label>
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

              <div className="text-xs text-gray-500 dark:text-gray-500">Wallet Balance: {balance.toFixed(2)} USDC</div>
            </div>

            <Button
              onClick={handleBuy}
              disabled={isProcessing || !amount || Number.parseFloat(amount) <= 0}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              {isProcessing ? "Processing..." : "Buy Tokens"}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Amount (USDC)</label>
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
              disabled={isProcessing || !amount || Number.parseFloat(amount) <= 0 || tokenAmount > userTokenBalance}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              {isProcessing ? "Processing..." : "Sell Tokens"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
