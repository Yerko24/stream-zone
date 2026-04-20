"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);

    // Simulación leve de carga (UX pro)
    setTimeout(() => {
      const success = login(email, password);

      if (!success) {
        setError("Correo o contraseña incorrectos");
      }

      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-black/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 max-w-md w-full shadow-2xl">

        {/* Título */}
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Bienvenido 👋
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Inicia sesión para continuar en Stream Zone
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition-all"
              placeholder="tu@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02]"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-6 pt-6">

          <p className="text-gray-400 text-center text-sm">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Regístrate
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}