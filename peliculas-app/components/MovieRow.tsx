"use client";

import { useRef } from "react";
import MovieCard from "./MovieCard";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

interface MovieRowProps {
  titulo: string;
  peliculas?: Movie[];
  showRanking?: boolean;
  onOpenTrailer?: (movie: Movie) => void;
}

export default function MovieRow({
  titulo,
  peliculas = [],
  showRanking = false,
  onOpenTrailer,
}: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  const peliculasUnicas = peliculas.filter(
    (movie, index, self) =>
      index === self.findIndex((m) => m.imdbID === movie.imdbID) &&
      movie.Poster &&
      movie.Poster !== "N/A"
  );

  return (
    <div className="mb-10">
      <h2 className="text-white text-2xl font-bold mb-4">{titulo}</h2>

      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-20 hidden group-hover:block"
        >
          ◀
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto">
          {peliculasUnicas.map((movie, index) => (
            <MovieCard
              key={`${movie.imdbID}-${index}`}
              movie={movie}
              rank={showRanking ? index + 1 : undefined}
              onOpenTrailer={onOpenTrailer}
            />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-20 hidden group-hover:block"
        >
          ▶
        </button>
      </div>
    </div>
  );
}