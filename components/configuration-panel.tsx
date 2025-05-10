"use client";

import type React from "react";

import { useState } from "react";
import type { Artist } from "@/lib/lensfluence";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface ConfigurationPanelProps {
  treasury: number;
  artists: Artist[];
  onTreasuryChange: (value: number) => void;
  onAddArtist: (artist: Artist) => void;
  onUpdateArtist: (index: number, artist: Artist) => void;
  onRemoveArtist: (index: number) => void;
}

export function ConfigurationPanel({
  treasury,
  artists,
  onTreasuryChange,
  onAddArtist,
  onUpdateArtist,
  onRemoveArtist,
}: ConfigurationPanelProps) {
  const [newArtist, setNewArtist] = useState<Artist>({
    name: "",
    currentFollowers: 1000,
    previousFollowers: 1000,
    supply: 1000,
    previousRawValue: 1,
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleTreasuryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onTreasuryChange(value);
    }
  };

  const handleArtistChange = (
    index: number,
    field: keyof Artist,
    value: string | number
  ) => {
    const numValue =
      typeof value === "string" ? Number.parseFloat(value) : value;

    if (field !== "name" && (isNaN(numValue) || numValue < 0)) {
      return;
    }

    const updatedArtist = {
      ...artists[index],
      [field]: field === "name" ? value : numValue,
    };
    onUpdateArtist(index, updatedArtist);
  };

  const handleNewArtistChange = (
    field: keyof Artist,
    value: string | number
  ) => {
    const numValue =
      typeof value === "string" ? Number.parseFloat(value) : value;

    if (field !== "name" && (isNaN(numValue) || numValue < 0)) {
      return;
    }

    setNewArtist({
      ...newArtist,
      [field]: field === "name" ? value : numValue,
    });
  };

  const handleAddArtist = () => {
    if (newArtist.name.trim() === "") {
      alert("Artist name cannot be empty");
      return;
    }

    onAddArtist(newArtist);
    setNewArtist({
      name: "",
      currentFollowers: 1000,
      previousFollowers: 1000,
      supply: 1000,
      previousRawValue: 1,
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="treasury" className="mr-2">
            Treasury ($GHO)
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Total $GHO available for distribution to token holders
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Artists</h3>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Artist
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle>Add New Artist</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Enter the details for the new artist
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Artist Name</Label>
                  <Input
                    id="name"
                    value={newArtist.name}
                    onChange={(e) =>
                      handleNewArtistChange("name", e.target.value)
                    }
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="currentFollowers" className="mr-2">
                        Current Followers
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current number of followers on Lens</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="currentFollowers"
                      type="number"
                      min="0"
                      value={newArtist.currentFollowers}
                      onChange={(e) =>
                        handleNewArtistChange(
                          "currentFollowers",
                          e.target.value
                        )
                      }
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="previousFollowers" className="mr-2">
                        Previous Followers
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Previous number of followers on Lens</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="previousFollowers"
                      type="number"
                      min="0"
                      value={newArtist.previousFollowers}
                      onChange={(e) =>
                        handleNewArtistChange(
                          "previousFollowers",
                          e.target.value
                        )
                      }
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="supply" className="mr-2">
                        Tokens Supply
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Number of tokens issued by the artist</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="supply"
                      type="number"
                      min="0"
                      value={newArtist.supply}
                      onChange={(e) =>
                        handleNewArtistChange("supply", e.target.value)
                      }
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="previousRawValue" className="mr-2">
                        Previous Price ($GHO)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Previous token price in $GHO (1 for new artists)
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="previousRawValue"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newArtist.previousRawValue}
                      onChange={(e) =>
                        handleNewArtistChange(
                          "previousRawValue",
                          e.target.value
                        )
                      }
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddArtist}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Add Artist
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow>
                <TableHead>Artist</TableHead>
                <TableHead>Current Followers</TableHead>
                <TableHead>Previous Followers</TableHead>
                <TableHead>Tokens Supply</TableHead>
                <TableHead>Previous Price</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artists.map((artist, index) => (
                <TableRow key={index} className="border-gray-700">
                  <TableCell>
                    <Input
                      value={artist.name}
                      onChange={(e) =>
                        handleArtistChange(index, "name", e.target.value)
                      }
                      className="bg-gray-700 border-gray-600 h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={artist.currentFollowers}
                      onChange={(e) =>
                        handleArtistChange(
                          index,
                          "currentFollowers",
                          e.target.value
                        )
                      }
                      className="bg-gray-700 border-gray-600 h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={artist.previousFollowers}
                      onChange={(e) =>
                        handleArtistChange(
                          index,
                          "previousFollowers",
                          e.target.value
                        )
                      }
                      className="bg-gray-700 border-gray-600 h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={artist.supply}
                      onChange={(e) =>
                        handleArtistChange(index, "supply", e.target.value)
                      }
                      className="bg-gray-700 border-gray-600 h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={artist.previousRawValue}
                      onChange={(e) =>
                        handleArtistChange(
                          index,
                          "previousRawValue",
                          e.target.value
                        )
                      }
                      className="bg-gray-700 border-gray-600 h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveArtist(index)}
                      className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-950/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {artists.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-500 py-4"
                  >
                    No artists added. Click "Add Artist" to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
