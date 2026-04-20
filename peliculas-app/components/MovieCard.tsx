"use client";

import Image from "next/image";
import { useState, useRef } from "react";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

interface MovieCardProps {
  movie: Movie;
  rank?: number;
  onOpenTrailer?: (movie: Movie) => void;
  onToggleFavorite?: (movie: Movie) => void;
  isFavorite?: boolean;
}

export default function MovieCard({
  movie,
  rank,
  onOpenTrailer,
  onToggleFavorite,
  isFavorite,
}: MovieCardProps) {
  const [imgSrc, setImgSrc] = useState(
    movie?.Poster && movie.Poster !== "N/A" ? movie.Poster : "/app.png"
  );

  const [showPreview, setShowPreview] = useState(false);
  const hoverRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    hoverRef.current = setTimeout(() => {
      setShowPreview(true);
    }, 400);
  };

  const handleLeave = () => {
    if (hoverRef.current) clearTimeout(hoverRef.current);
    setShowPreview(false);
  };

  if (!movie) return null;

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative w-40 md:w-48 lg:w-56 flex-shrink-0 cursor-pointer"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <Image
          src={imgSrc}
          alt={movie.Title}
          fill
          className="object-cover"
          unoptimized
          onError={() => setImgSrc("/app.png")}
        />

        {rank && (
          <div className="absolute left-2 bottom-2 text-[4rem] font-black text-white/10">
            {rank}
          </div>
        )}

        {showPreview && (
          <div className="absolute inset-0 bg-black/85 flex flex-col justify-end p-3 z-20">
            <h3 className="text-white font-bold text-sm line-clamp-2">
              {movie.Title}
            </h3>

            <p className="text-gray-300 text-xs mb-3">{movie.Year}</p>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTrailer?.(movie);
                }}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-xs font-semibold"
              >
                ▶ Trailer
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.(movie);
                }}
                className={`px-2 py-1 rounded text-white text-xs ${
                  isFavorite
                    ? "bg-red-600"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {isFavorite ? "❤️" : "🤍"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2">
        <p className="text-white text-sm font-semibold line-clamp-2">
          {movie.Title}
        </p>
        <p className="text-gray-400 text-xs">{movie.Year}</p>
      </div>
    </div>
  );
}