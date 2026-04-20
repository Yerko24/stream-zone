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
          setError("API de YouTube no configurada");
          return;
        }

        const query = encodeURIComponent(
          `${movieTitle} trailer oficial HD`
        );

        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}&maxResults=1&type=video`
        );

        const data = await res.json();

        if (data.items?.length > 0) {
          setVideoId(data.items[0].id.videoId);
        } else {
          setError("No se encontró trailer");
        }
      } catch {
        setError("Error al cargar trailer");
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
            <p className="text-white text-center">Sin trailer</p>
          )}
        </div>
      </div>
    </div>
  );
}