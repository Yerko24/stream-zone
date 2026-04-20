"use client";

import { useAuth } from "@/contexts/AuthContext";
import MovieCard from "@/components/MovieCard";
import { useEffect, useState } from "react";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export default function FavoritosPage() {
  const { favorites } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const results = await Promise.all(
          favorites.map((id) =>
            fetch(`https://www.omdbapi.com/?apikey=64ef769b&i=${id}`)
              .then((res) => res.json())
          )
        );

        // Filtrar resultados válidos
        const validMovies = results.filter((m) => m && m.imdbID);
        setMovies(validMovies);
      } catch (error) {
        console.error("Error cargando favoritos:", error);
        setMovies([]);
      }
    };

    if (favorites.length > 0) {
      fetchFavorites();
    } else {
      setMovies([]);
    }
  }, [favorites]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">❤️ Mis Favoritos</h1>

      {movies.length === 0 ? (
        <p className="text-gray-400">
          No tienes películas guardadas aún.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
            />
          ))}
        </div>
      )}
    </div>
  );
}