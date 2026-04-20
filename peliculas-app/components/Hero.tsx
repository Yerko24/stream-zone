"use client";

import Image from "next/image";
import { useState } from "react";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot?: string;
}

interface HeroProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
  onTrailer?: (movie: Movie) => void;
  onAddToList?: (movie: Movie) => void;
}

export default function Hero({ movie, onPlay, onTrailer, onAddToList }: HeroProps) {
  const [imgSrc, setImgSrc] = useState(
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "/app.png"
  );

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imgSrc}
          alt={movie.Title}
          fill
          className="object-cover"
          unoptimized
          onError={() => setImgSrc("/app.png")}
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-2xl text-white">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {movie.Title}
          </h1>

          {/* Year & Rating */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-lg font-semibold">{movie.Year}</span>
            <span className="bg-red-600 px-2 py-1 rounded text-sm font-bold">HD</span>
          </div>

          {/* Description */}
          <p className="text-lg mb-8 leading-relaxed max-w-xl">
            {movie.Plot || "Descubre esta increíble película llena de acción y emoción."}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onPlay?.(movie)}
              className="bg-white text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              ▶ Ver ahora
            </button>

            <button
              onClick={() => onTrailer?.(movie)}
              className="bg-gray-500/70 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-500 transition flex items-center gap-2"
            >
              🎬 Ver trailer
            </button>

            <button
              onClick={() => onAddToList?.(movie)}
              className="bg-gray-500/70 text-white p-3 rounded-full hover:bg-gray-500 transition"
              title="Agregar a Mi Lista"
            >
              ➕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}