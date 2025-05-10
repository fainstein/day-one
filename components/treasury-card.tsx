"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface TreasuryCardProps {
  treasury: number;
  onTreasuryChange: (value: number) => void;
  totalRequiredUSDC: number;
  scalingFactor: number;
  totalPaid: number;
}

export function TreasuryCard({
  treasury,
  onTreasuryChange,
  totalRequiredUSDC,
  scalingFactor,
  totalPaid,
}: TreasuryCardProps) {
  const handleTreasuryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onTreasuryChange(value);
    }
  };

  const handleSliderChange = (value: number[]) => {
    onTreasuryChange(value[0]);
  };

  // Calculate percentage of treasury used
  const percentageUsed = treasury > 0 ? (totalPaid / treasury) * 100 : 0;

  return (
    <Card className="bg-gray-800 border-gray-700 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          Treasury
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-gray-400 ml-2" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Total $GHO available for distribution to token holders
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="treasury" className="text-sm">
                Treasury Amount ($GHO)
              </Label>
              <span className="text-sm text-gray-400">
                {treasury.toLocaleString()} $GHO
              </span>
            </div>
            <div className="pt-2 pb-4">
              <Slider
                defaultValue={[treasury]}
                max={20000}
                step={100}
                value={[treasury]}
                onValueChange={handleSliderChange}
                className="py-1"
              />
            </div>
            <Input
              id="treasury"
              type="number"
              min="0"
              step="100"
              value={treasury}
              onChange={handleTreasuryChange}
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <div className="flex items-center">
                <span className="text-sm text-gray-400">Required $GHO:</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-3 w-3 text-gray-500 ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Sum of (Raw Value × Supply) for all artists
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="font-medium">
                {totalRequiredUSDC.toLocaleString()} $GHO
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center">
                <span className="text-sm text-gray-400">Scaling Factor:</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-3 w-3 text-gray-500 ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        min(1, Treasury ÷ Required USDC)
                      </p>
                      <p className="text-xs mt-1">
                        Adjusts prices when treasury can't cover all required
                        USDC
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="font-medium">{scalingFactor.toFixed(4)}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-sm text-gray-400">Total Paid:</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-3 w-3 text-gray-500 ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Sum of (Final Price × Supply) for all artists
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="font-semibold text-emerald-400">
                {totalPaid.toLocaleString()} USDC
              </span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-emerald-500 h-2.5 rounded-full"
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
