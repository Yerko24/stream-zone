"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "../components/SearchBar";
import MovieRow from "../components/MovieRow";
import MovieCard from "../components/MovieCard";
import TrailerModal from "../components/TrailerModal";
import Hero from "../components/Hero";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [top10Peliculas, setTop10Peliculas] = useState<Movie[]>([]);
  const [top10Series, setTop10Series] = useState<Movie[]>([]);
  const [tendencias, setTendencias] = useState<Movie[]>([]);
  const [populares, setPopulares] = useState<Movie[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

  // 🔥 NUEVO: índice del carrusel
  const [heroIndex, setHeroIndex] = useState(0);

  const openTrailer = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeTrailer = () => {
    setSelectedMovie(null);
  };

  const playMovie = (movie: Movie) => {
    openTrailer(movie);
  };

  const addToList = (movie: Movie) => {
    console.log("Agregar a lista:", movie.Title);
  };

  async function loadAutomaticContent() {
    setLoadingContent(true);

    try {
      const searches = [
        { term: "avengers", setState: setTop10Peliculas },
        { term: "batman", setState: setTop10Peliculas },
        { term: "game of thrones", setState: setTop10Series },
        { term: "breaking bad", setState: setTop10Series },
        { term: "spider-man", setState: setTendencias },
        { term: "oppenheimer", setState: setTendencias },
        { term: "stranger things", setState: setPopulares },
      ];

      const promises = searches.map(({ term }) =>
        fetch(`https://www.omdbapi.com/?apikey=64ef769b&s=${encodeURIComponent(term)}`)
          .then((res) => res.json())
          .catch(() => ({ Response: "False" }))
      );

      const results = await Promise.all(promises);

      results.forEach((result, index) => {
        if (result.Response === "True") {
          searches[index].setState((prev: Movie[]) => {
            const nuevos = result.Search.slice(0, 8).filter(
              (m: Movie) => !prev.some((p) => p.imdbID === m.imdbID)
            );
            return [...prev, ...nuevos];
          });
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingContent(false);
    }
  }

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (isLoggedIn) {
      loadAutomaticContent();
    }
  }, [isLoggedIn]);

  // 🔥 AUTOPLAY HERO (cada 5 segundos)
  useEffect(() => {
    if (tendencias.length === 0) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(tendencias.length, 5));
    }, 5000);

    return () => clearInterval(interval);
  }, [tendencias]);

  const fetchMovies = async () => {
    if (!search.trim()) return;

    setLoadingSearch(true);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=64ef769b&s=${encodeURIComponent(search)}`
      );
      const data = await res.json();

      if (data.Response === "True") {
        setSearchResults(data.Search);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  if (!isLoggedIn) return null;

  // 🔥 LISTA DE HERO (máx 5 pelis)
  const heroMovies = tendencias.slice(0, 5);
  const featuredMovie = heroMovies[heroIndex];

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-black via-gray-900 to-black">

      {/* 🔥 HERO DINÁMICO */}
      {featuredMovie && (
        <Hero
          key={featuredMovie.imdbID} // 👈 fuerza animación
          movie={featuredMovie}
          onPlay={playMovie}
          onTrailer={openTrailer}
          onAddToList={addToList}
        />
      )}

      {/* 🔍 SEARCH */}
      <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
        <SearchBar
          search={search}
          setSearch={setSearch}
          onSearch={fetchMovies}
          loading={loadingSearch}
        />

        {searchResults.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">
              {`Resultados: "${search}"`}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchResults.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onOpenTrailer={openTrailer}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🎬 CONTENIDO */}
      <div className="px-4 max-w-7xl mx-auto pb-12">
        {loadingContent ? (
          <p className="text-center">Cargando...</p>
        ) : (
          <>
            <MovieRow
              titulo="🎬 Top Películas"
              peliculas={top10Peliculas}
              showRanking
              onOpenTrailer={openTrailer}
            />

            <MovieRow
              titulo="📺 Top Series"
              peliculas={top10Series}
              onOpenTrailer={openTrailer}
            />

            <MovieRow
              titulo="⭐ Tendencias"
              peliculas={tendencias}
              onOpenTrailer={openTrailer}
            />

            <MovieRow
              titulo="🔥 Populares"
              peliculas={populares}
              onOpenTrailer={openTrailer}
            />
          </>
        )}
      </div>

      {/* 🎥 MODAL */}
      <TrailerModal
        isOpen={selectedMovie !== null}
        movieTitle={selectedMovie?.Title || ""}
        onClose={closeTrailer}
      />
    </div>
  );
}