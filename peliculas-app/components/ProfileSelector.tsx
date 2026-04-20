"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

interface ProfileSelectorProps {
  onProfileSelected: () => void;
}

export default function ProfileSelector({ onProfileSelected }: ProfileSelectorProps) {
  const { perfiles, crearPerfil, seleccionarPerfil, userEmail } = useAuth();
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const router = useRouter();

  const handleCrearPerfil = () => {
    if (nuevoNombre.trim() && userEmail) {
      crearPerfil(nuevoNombre, userEmail);
      setNuevoNombre("");
      setMostrarFormulario(false);
    }
  };

  const handleSeleccionarPerfil = (perfil: any) => {
    seleccionarPerfil(perfil);
    onProfileSelected();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold text-white mb-4">
          🎬 Stream Zone
        </h1>
        <p className="text-2xl text-gray-300">
          ¿Quién está viendo?
        </p>
      </div>

      {/* Grid de perfiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12 max-w-4xl">
        {perfiles.map((perfil) => (
          <button
            key={perfil.id}
            onClick={() => handleSeleccionarPerfil(perfil)}
            className="group cursor-pointer"
          >
            <div className="relative w-full aspect-square mb-4">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-5xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl shadow-lg border-4 border-transparent group-hover:border-blue-400">
                👤
              </div>
            </div>
            <p className="text-white text-center font-semibold group-hover:text-blue-400 transition-colors">
              {perfil.nombre}
            </p>
          </button>
        ))}

        {/* Botón para crear perfil */}
        {perfiles.length < 4 && (
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="group cursor-pointer"
          >
            <div className="w-full aspect-square rounded-2xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-5xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl shadow-lg border-4 border-dashed border-gray-600 group-hover:border-blue-400">
              ➕
            </div>
            <p className="text-gray-400 text-center font-semibold group-hover:text-blue-400 transition-colors">
              Nuevo Perfil
            </p>
          </button>
        )}
      </div>

      {/* Formulario para crear perfil */}
      {mostrarFormulario && (
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 max-w-md w-full mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Crear Perfil
          </h2>
          <input
            type="text"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            placeholder="Nombre del perfil"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCrearPerfil();
              }
            }}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-blue-500 focus:outline-none transition-colors mb-4"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={handleCrearPerfil}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              Crear
            </button>
            <button
              onClick={() => setMostrarFormulario(false)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Botón cerrar sesión */}
      <button
        onClick={() => {
          router.push("/login");
        }}
        className="text-gray-400 hover:text-white text-sm font-semibold transition-colors"
      >
        Cambiar cuenta
      </button>
    </div>
  );
}
