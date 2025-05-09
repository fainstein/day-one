"use client"

import { useMockData } from "@/lib/mock-data-provider"
import ArtistCard from "@/components/artist-card"

export default function Home() {
  const { artists } = useMockData()

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400">
          ForeTalent
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">Trade the Future of Culture</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  )
}
