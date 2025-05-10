"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function InfoCard() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-sm">How It Works</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-3">
        <div>
          <p className="font-medium text-emerald-400">Success Index (SI)</p>
          <p className="text-gray-400">Measures growth by comparing current followers to previous followers.</p>
        </div>

        <div>
          <p className="font-medium text-emerald-400">Raw Value</p>
          <p className="text-gray-400">Base token price that grows with social metrics.</p>
        </div>

        <div>
          <p className="font-medium text-emerald-400">Scaling Factor</p>
          <p className="text-gray-400">Adjusts prices when treasury can't cover all tokens at raw value.</p>
        </div>

        <div className="pt-1">
          <p className="text-gray-500 italic">
            Try changing the Treasury amount or Current Followers to see how prices adjust!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
