import ArtistCard from "@/components/artist-card";
import Image from "next/image";
import { ARTISTS_ACCOUNTS } from "@/lib/constants";

export default function Home() {
  const artistList = Object.values(ARTISTS_ACCOUNTS);

  return (
    <div className="space-y-8">
      <div className="text-center flex flex-col items-center space-y-4">
        <Image src="/logo.png" alt="Day One" width={170} height={170} />
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
        {artistList.map((accountAddress) => (
          <ArtistCard key={accountAddress} accountAddress={accountAddress} />
        ))}
      </div>
    </div>
  );
}
