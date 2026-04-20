"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import SearchBar from "../../components/SearchBar";
import MovieRow from "../../components/MovieRow";
import MovieCard from "../../components/MovieCard";
import TrailerModal from "../../components/TrailerModal";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export default function PeliculasPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState("");
  const [populares, setPopulares] = useState<Movie[]>([]);
  const [nuevas, setNuevas] = useState<Movie[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const openTrailer = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeTrailer = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (isLoggedIn) {
      loadPeliculas();
    }
  }, [isLoggedIn]);

  const loadPeliculas = async () => {
    setLoadingContent(true);

    try {
      const queries = [
        { term: "the dark knight", setter: setPopulares },
        { term: "inception", setter: setPopulares },
        { term: "scarface", setter: setPopulares },
        { term: "dune", setter: setNuevas },
        { term: "top gun", setter: setNuevas },
      ];

      const results = await Promise.all(
        queries.map(({ term }) =>
          fetch(`https://www.omdbapi.com/?apikey=64ef769b&s=${encodeURIComponent(term)}`)
            .then((res) => res.json())
            .catch(() => ({ Response: "False" }))
        )
      );

      results.forEach((result, index) => {
        if (result.Response === "True" && result.Search) {
          queries[index].setter((prev) => [...prev, ...result.Search.slice(0, 6)]);
        }
      });
    } catch (error) {
      console.error("Error cargando películas:", error);
    } finally {
      setLoadingContent(false);
    }
  };

  const fetchMovies = async () => {
    if (!search.trim()) return;

    setLoadingSearch(true);
    setErrorSearch("");

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=64ef769b&s=${encodeURIComponent(search)}`
      );
      const data = await res.json();

      if (data.Response === "True") {
        setSearchResults(data.Search);
      } else {
        setSearchResults([]);
        setErrorSearch(data.Error || "No se encontraron resultados");
      }
    } catch (error) {
      setErrorSearch("Error al buscar películas. Inténtalo de nuevo.");
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-black via-gray-900 to-black pt-28">
      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Películas</h1>
          <p className="text-gray-400">Explora las mejores películas y encuentra tu próxima maratón.</p>
        </div>

        <SearchBar
          search={search}
          setSearch={setSearch}
          onSearch={fetchMovies}
          loading={loadingSearch}
        />

        {searchResults.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Resultados para "{search}"</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {errorSearch && (
          <div className="mt-10 text-center">
            <p className="text-red-500">{errorSearch}</p>
          </div>
        )}

        <div className="mt-14">
          {loadingContent ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              <p className="mt-4 text-gray-400">Cargando categorías de películas...</p>
            </div>
          ) : (
            <>
              {populares.length > 0 && (
                <MovieRow titulo="🎥 Populares" peliculas={populares} showRanking onOpenTrailer={openTrailer} />
              )}
              {nuevas.length > 0 && (
                <MovieRow titulo="🆕 Estrenos Recomendados" peliculas={nuevas} onOpenTrailer={openTrailer} />
              )}
            </>
          )}
        </div>
      </div>

      <TrailerModal
        isOpen={selectedMovie !== null}
        movieTitle={selectedMovie?.Title || ""}
        onClose={closeTrailer}
      />
    </div>
  );
}
