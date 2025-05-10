"use client"
import type { Artist, CalculationResult } from "@/lib/lensfluence"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, Users, Coins } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

interface ArtistCardProps {
  artist: Artist
  result?: CalculationResult
  onUpdate: (artist: Artist) => void
  onRemove: () => void
}

export function ArtistCard({ artist, result, onUpdate, onRemove }: ArtistCardProps) {
  const handleCurrentFollowersChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      onUpdate({ ...artist, currentFollowers: numValue })
    }
  }

  const handleSupplyChange = (value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      onUpdate({ ...artist, supply: numValue })
    }
  }

  // Calculate growth percentage
  const growthPercentage =
    artist.previousFollowers > 0
      ? ((artist.currentFollowers - artist.previousFollowers) / artist.previousFollowers) * 100
      : 0

  // Determine growth color
  const growthColor = growthPercentage > 0 ? "text-green-500" : growthPercentage < 0 ? "text-red-500" : "text-gray-400"

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <CardHeader className="bg-gray-900 pb-2 flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-white">{artist.name}</h3>
          <div className="flex items-center text-xs text-gray-400 mt-1">
            <Users className="h-3 w-3 mr-1" />
            <span>Previous: {artist.previousFollowers.toLocaleString()}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-950/50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="pt-4 pb-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor={`currentFollowers-${artist.name}`} className="text-sm">
                Current Followers
              </Label>
              {growthPercentage !== 0 && (
                <span className={`text-xs ${growthColor}`}>
                  {growthPercentage > 0 ? "+" : ""}
                  {growthPercentage.toFixed(1)}%
                </span>
              )}
            </div>
            <Input
              id={`currentFollowers-${artist.name}`}
              type="number"
              min="0"
              value={artist.currentFollowers}
              onChange={(e) => handleCurrentFollowersChange(e.target.value)}
              className="bg-gray-700 border-gray-600 h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`supply-${artist.name}`} className="text-sm">
              Token Supply
            </Label>
            <Input
              id={`supply-${artist.name}`}
              type="number"
              min="0"
              value={artist.supply}
              onChange={(e) => handleSupplyChange(e.target.value)}
              className="bg-gray-700 border-gray-600 h-9"
            />
          </div>

          {result && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className="text-gray-400">Success Index:</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-3 w-3 text-gray-500 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Current Followers ÷ Previous Followers</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span>{result.si.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className="text-gray-400">Raw Value:</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-3 w-3 text-gray-500 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Previous Price × Success Index</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span>{result.rawValue.toFixed(2)} USDC</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className="text-gray-400">Required USDC:</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-3 w-3 text-gray-500 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Raw Value × Token Supply</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span>{result.requiredUSDC.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {result && (
        <CardFooter className="bg-gray-900/50 border-t border-gray-700 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Coins className="h-4 w-4 text-emerald-400 mr-2" />
            <span className="text-sm font-medium">Final Price:</span>
          </div>
          <span className="text-lg font-bold text-emerald-400">{result.finalPrice.toFixed(2)} USDC</span>
        </CardFooter>
      )}
    </Card>
  )
}
