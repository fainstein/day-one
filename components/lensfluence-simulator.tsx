"use client";

import { useState, useEffect } from "react";
import {
  type Artist,
  type CalculationResult,
  calculateLensFluence,
} from "@/lib/lensfluence";
import { ArtistCard } from "@/components/sumlated-artist-card";
import { TreasuryCard } from "@/components/treasury-card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoCard } from "@/components/info-card";

export function LensFluenceSimulator() {
  const initialArtists: Artist[] = [
    {
      name: "Emerging Artist",
      currentFollowers: 3000,
      previousFollowers: 1500,
      supply: 2000,
      previousRawValue: 3,
    },
    {
      name: "Rising Star",
      currentFollowers: 5000,
      previousFollowers: 2000,
      supply: 1000,
      previousRawValue: 2,
    },
    {
      name: "Hidden Gem",
      currentFollowers: 1000,
      previousFollowers: 333.33,
      supply: 1000,
      previousRawValue: 1,
    },
  ];

  const [treasury, setTreasury] = useState<number>(9000);
  const [artists, setArtists] = useState<Artist[]>(initialArtists);
  const [results, setResults] = useState<{
    results: CalculationResult[];
    totalRequiredUSDC: number;
    scalingFactor: number;
    totalPaid: number;
  } | null>(null);
  const [newArtist, setNewArtist] = useState<Artist>({
    name: "",
    currentFollowers: 1000,
    previousFollowers: 1000,
    supply: 1000,
    previousRawValue: 1,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  // Calculate results on initial load and when data changes
  useEffect(() => {
    calculateResults();
  }, []);

  const calculateResults = () => {
    const calculationResults = calculateLensFluence(artists, treasury);
    setResults(calculationResults);
  };

  const handleAddArtist = () => {
    if (newArtist.name.trim() === "") {
      alert("Artist name cannot be empty");
      return;
    }

    setArtists([...artists, newArtist]);
    setNewArtist({
      name: "",
      currentFollowers: 1000,
      previousFollowers: 1000,
      supply: 1000,
      previousRawValue: 1,
    });
    setIsAddDialogOpen(false);
    setTimeout(() => calculateResults(), 0);
  };

  const handleUpdateArtist = (index: number, updatedArtist: Artist) => {
    const newArtists = [...artists];
    newArtists[index] = updatedArtist;
    setArtists(newArtists);
    calculateResults();
  };

  const handleRemoveArtist = (index: number) => {
    const newArtists = [...artists];
    newArtists.splice(index, 1);
    setArtists(newArtists);
    calculateResults();
  };

  const handleTreasuryChange = (value: number) => {
    setTreasury(value);
    calculateResults();
  };

  const handleReset = () => {
    setArtists(initialArtists);
    setTreasury(9000);
    setTimeout(() => calculateResults(), 0);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <HelpCircle className="h-4 w-4" />
              How it works
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle>How Day One Works</DialogTitle>
              <DialogDescription className="text-gray-400">
                Understanding early investment in emerging talent
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 text-sm">
              <p>
                Day One is a platform that lets you invest in emerging artists,
                athletes, and cultural icons before they become mainstream.
                Here's how it works:
              </p>

              <div className="space-y-2">
                <h3 className="font-semibold text-emerald-400">Key Concepts</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <span className="font-medium">Growth Potential</span>:
                    Measured by the ratio of current followers to previous
                    followers
                  </li>
                  <li>
                    <span className="font-medium">Token Value</span>: The base
                    price calculated based on the creator's growth trajectory
                  </li>
                  <li>
                    <span className="font-medium">Investment Pool</span>: The
                    total amount available to invest in emerging talent
                  </li>
                  <li>
                    <span className="font-medium">Market Adjustment</span>:
                    Balances token prices based on available investment funds
                  </li>
                  <li>
                    <span className="font-medium">Final Price</span>: The actual
                    token price after market adjustments
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-emerald-400">
                  How to Use the Simulator
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Adjust the{" "}
                    <span className="font-medium">Investment Pool</span> to see
                    how available funds affect token prices
                  </li>
                  <li>
                    Change{" "}
                    <span className="font-medium">Current Followers</span> to
                    simulate creator growth
                  </li>
                  <li>
                    Modify <span className="font-medium">Token Supply</span> to
                    see how it affects investment distribution
                  </li>
                  <li>
                    Add new creators to discover and invest in emerging talent
                  </li>
                </ul>
              </div>

              <div className="bg-gray-900 p-3 rounded-md">
                <p className="text-gray-300 italic">
                  The real investment platform will be implemented on the
                  blockchain. This simulator helps you understand how early
                  investment in emerging talent works.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <TreasuryCard
          treasury={treasury}
          onTreasuryChange={handleTreasuryChange}
          totalRequiredUSDC={results?.totalRequiredUSDC || 0}
          scalingFactor={results?.scalingFactor || 0}
          totalPaid={results?.totalPaid || 0}
        />

        <InfoCard />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map((artist, index) => (
          <ArtistCard
            key={index}
            artist={artist}
            result={results?.results[index]}
            onUpdate={(updatedArtist) =>
              handleUpdateArtist(index, updatedArtist)
            }
            onRemove={() => handleRemoveArtist(index)}
          />
        ))}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <div className="border border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center h-full min-h-[300px] bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer">
              <Plus className="h-12 w-12 text-gray-500 mb-2" />
              <p className="text-gray-500">Add New Creator</p>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle>Add New Creator</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter the details for the new creator you want to invest in
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Creator Name</Label>
                <Input
                  id="name"
                  value={newArtist.name}
                  onChange={(e) =>
                    setNewArtist({ ...newArtist, name: e.target.value })
                  }
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currentFollowers">Current Followers</Label>
                <Input
                  id="currentFollowers"
                  type="number"
                  min="0"
                  value={newArtist.currentFollowers}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value);
                    if (!isNaN(value) && value >= 0) {
                      setNewArtist({ ...newArtist, currentFollowers: value });
                    }
                  }}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supply">Token Supply</Label>
                <Input
                  id="supply"
                  type="number"
                  min="0"
                  value={newArtist.supply}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value);
                    if (!isNaN(value) && value >= 0) {
                      setNewArtist({ ...newArtist, supply: value });
                    }
                  }}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="previousFollowers"
                  className="text-gray-400 text-xs"
                >
                  Previous Followers (Locked)
                </Label>
                <Input
                  id="previousFollowers"
                  type="number"
                  value={newArtist.previousFollowers}
                  disabled
                  className="bg-gray-700/50 border-gray-600 text-gray-400"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="previousRawValue"
                  className="text-gray-400 text-xs"
                >
                  Previous Price (Locked)
                </Label>
                <Input
                  id="previousRawValue"
                  type="number"
                  value={newArtist.previousRawValue}
                  disabled
                  className="bg-gray-700/50 border-gray-600 text-gray-400"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddArtist}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Add Creator
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
