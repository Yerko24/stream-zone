"use client";

import { useEffect, useState } from "react";

interface TrailerModalProps {
  isOpen: boolean;
  movieTitle: string;
  onClose: () => void;
}

export default function TrailerModal({
  isOpen,
  movieTitle,
  onClose,
}: TrailerModalProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !movieTitle) {
      setVideoId(null);
      setError("");
      setLoading(false);
      return;
    }

    const fetchTrailer = async () => {
      setLoading(true);
      setError("");
      setVideoId(null);

      try {
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

        if (!API_KEY) {
          setError("API de YouTube no configurada - falta NEXT_PUBLIC_YOUTUBE_API_KEY");
          console.error("YouTube API key not configured");
          return;
        }

        const query = encodeURIComponent(
          `${movieTitle} trailer oficial HD`
        );

        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}&maxResults=1&type=video`
        );

        const data = await res.json();

        // Log full API response for debugging
        console.log("YouTube API Response:", {
          status: res.status,
          statusText: res.statusText,
          data: data,
          url: res.url
        });

        if (!res.ok) {
          // Handle specific API errors
          if (res.status === 403) {
            if (data.error?.errors?.[0]?.reason === 'quotaExceeded') {
              setError("Cuota de API de YouTube excedida - intenta más tarde");
            } else if (data.error?.errors?.[0]?.reason === 'accessNotConfigured') {
              setError("API de YouTube no habilitada - verifica la configuración");
            } else {
              setError("Acceso denegado a la API de YouTube - verifica la clave API");
            }
          } else if (res.status === 400) {
            setError("Solicitud inválida a la API de YouTube");
          } else {
            setError(`Error de API de YouTube (${res.status}): ${data.error?.message || res.statusText}`);
          }
          return;
        }

        if (data.items?.length > 0) {
          setVideoId(data.items[0].id.videoId);
        } else {
          // Fallback trailer for popular movies
          const fallbackTrailers: Record<string, string> = {
            "The Matrix": "vKQi3bBA1y8",
            "Inception": "YoHD9XEInc0",
            "Interstellar": "zSWdZVtXT7E",
            "The Dark Knight": "EXeTwQWrcwY",
            "Pulp Fiction": "s7EdQ4FqbhY",
            "Avengers: Endgame": "TcMBFSGVi1c",
            "Spider-Man: No Way Home": "JfVOs4VSpmA",
            "The Shawshank Redemption": "6hB3S9bIaco",
            "Forrest Gump": "bLvqoHBptjg",
            "The Godfather": "sY1S34973zA"
          };

          const fallbackId = fallbackTrailers[movieTitle] || "dQw4w9WgXcQ"; // Rickroll as last resort
          setVideoId(fallbackId);
          setError("No se encontró trailer oficial, mostrando trailer alternativo");
        }
      } catch (err) {
        console.error("Error fetching YouTube trailer:", err);
        setError("Error de conexión al cargar trailer");

        // Fallback to a generic trailer
        setVideoId("dQw4w9WgXcQ"); // Rickroll as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [isOpen, movieTitle]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-black rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center bg-gray-900">
          <h2 className="text-white font-bold">{movieTitle}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="aspect-video bg-black">
          {loading && <p className="text-white text-center">Cargando...</p>}

          {videoId && (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
              className="w-full h-full"
              allowFullScreen
            />
          )}

          {!videoId && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-white text-center p-4">
              <p className="text-lg mb-2">Sin trailer disponible</p>
              {error && (
                <p className="text-sm text-gray-400 max-w-md">{error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}