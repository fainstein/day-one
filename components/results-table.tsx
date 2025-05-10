"use client"

import type { Artist, CalculationResult } from "@/lib/lensfluence"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

interface ResultsTableProps {
  artists: Artist[]
  results: CalculationResult[]
  totalRequiredUSDC: number
  scalingFactor: number
  totalPaid: number
}

export function ResultsTable({ artists, results, totalRequiredUSDC, scalingFactor, totalPaid }: ResultsTableProps) {
  return (
    <div className="rounded-md border border-gray-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-900">
          <TableRow>
            <TableHead>Artist</TableHead>
            <TableHead>
              <div className="flex items-center">
                <span className="mr-1">SI</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Success Index = Current Followers / Previous Followers</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                <span className="mr-1">Raw Value</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Raw Value = Previous Raw Value * SI</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
            <TableHead>Supply</TableHead>
            <TableHead>
              <div className="flex items-center">
                <span className="mr-1">Required USDC</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Required USDC = Raw Value * Supply</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                <span className="mr-1">Final Price</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Final Price = Raw Value * Scaling Factor</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index} className="border-gray-700">
              <TableCell className="font-medium">{artists[index].name}</TableCell>
              <TableCell>{result.si.toFixed(4)}</TableCell>
              <TableCell>{result.rawValue.toFixed(4)}</TableCell>
              <TableCell>{artists[index].supply}</TableCell>
              <TableCell>{result.requiredUSDC.toFixed(4)}</TableCell>
              <TableCell className="font-semibold text-emerald-400">{result.finalPrice.toFixed(4)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="border-t-2 border-gray-700 bg-gray-900/50">
            <TableCell colSpan={4} className="font-semibold text-right">
              Total Required USDC:
            </TableCell>
            <TableCell colSpan={2} className="font-semibold">
              {totalRequiredUSDC.toFixed(4)}
            </TableCell>
          </TableRow>
          <TableRow className="bg-gray-900/50">
            <TableCell colSpan={4} className="font-semibold text-right">
              <div className="flex items-center justify-end">
                <span className="mr-1">Scaling Factor:</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Scaling Factor = min(1, Treasury / Total Required USDC)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableCell>
            <TableCell colSpan={2} className="font-semibold">
              {scalingFactor.toFixed(4)}
            </TableCell>
          </TableRow>
          <TableRow className="bg-gray-900/50">
            <TableCell colSpan={4} className="font-semibold text-right">
              Total Paid:
            </TableCell>
            <TableCell colSpan={2} className="font-semibold text-emerald-400">
              {totalPaid.toFixed(4)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
