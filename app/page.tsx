"use client";

import { useMockData } from "@/lib/mock-data-provider";
import ArtistCard from "@/components/artist-card";
import Image from "next/image";
export default function Home() {
  const { artists } = useMockData();

  return (
    <div className="space-y-8">
      <div className="text-center flex flex-col items-center space-y-4">
        <Image src="/logo.png" alt="Day One" width={170} height={170} />
        {/* <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400"> */}
        {/* Day One */}
        {/* </h1> */}
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Because if you saw it on{" "}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400">
            Day One
          </span>{" "}
          <br />
          You deserve a piece when{" "}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400">
            they won
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}
