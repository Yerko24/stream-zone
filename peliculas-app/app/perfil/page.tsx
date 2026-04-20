"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function PerfilPage() {
  const {
    isLoggedIn,
    userEmail,
    perfilActual,
    editarPerfil,
    cambiarContrasena,
  } = useAuth();
  const router = useRouter();
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nombreExito, setNombreExito] = useState("");
  const [nombreError, setNombreError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (perfilActual) {
      setNuevoNombre(perfilActual.nombre);
    }
  }, [perfilActual]);

  const handleUpdateName = () => {
    if (!perfilActual) return;

    if (!nuevoNombre.trim()) {
      setNombreError("El nombre de perfil no puede quedar vacío.");
      setNombreExito("");
      return;
    }

    editarPerfil(perfilActual.id, nuevoNombre.trim());
    setNombreExito("Nombre de perfil actualizado correctamente.");
    setNombreError("");
  };

  const handlePasswordChange = () => {
    setPasswordError("");
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Completa todos los campos de contraseña.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden.");
      return;
    }

    const result = cambiarContrasena(currentPassword, newPassword);

    if (result.success) {
      setPasswordMessage(result.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordError(result.message);
    }
  };

  if (!isLoggedIn || !perfilActual) {
    return null;
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-black via-gray-900 to-black pt-28">
      <div className="px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-gray-400">Gestiona tu perfil y actualiza tu cuenta de forma segura.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-8">
            <section className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-4">Información del perfil</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-gray-800/80 rounded-2xl p-5">
                  <p className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-2">Perfil activo</p>
                  <p className="text-lg font-semibold text-white">{perfilActual.nombre}</p>
                </div>
                <div className="bg-gray-800/80 rounded-2xl p-5">
                  <p className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-2">Email</p>
                  <p className="text-lg font-semibold text-white">{userEmail}</p>
                </div>
              </div>
            </section>

            <section className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-4">Editar nombre de perfil</h2>
              <label className="block text-sm text-gray-300 mb-2">Nombre</label>
              <input
                type="text"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                className="w-full rounded-2xl border border-gray-700 bg-black/60 px-4 py-3 text-white focus:border-blue-500 outline-none"
              />
              <button
                onClick={handleUpdateName}
                className="mt-4 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                Guardar cambios
              </button>
              {nombreExito && <p className="mt-4 text-sm text-emerald-400">{nombreExito}</p>}
              {nombreError && <p className="mt-4 text-sm text-red-400">{nombreError}</p>}
            </section>

            <section className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-4">Cambiar contraseña</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Contraseña actual</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-700 bg-black/60 px-4 py-3 text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Nueva contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-700 bg-black/60 px-4 py-3 text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-700 bg-black/60 px-4 py-3 text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handlePasswordChange}
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500"
              >
                Actualizar contraseña
              </button>

              {passwordMessage && <p className="mt-4 text-sm text-emerald-400">{passwordMessage}</p>}
              {passwordError && <p className="mt-4 text-sm text-red-400">{passwordError}</p>}
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-4">Atajos rápidos</h2>
              <div className="space-y-3 text-sm text-gray-300">
                <p>• Actualiza tu perfil y disfruta de recomendaciones más personales.</p>
                <p>• Cambia la contraseña en cualquier momento para mantener tu cuenta segura.</p>
                <p>• Usa el navegador superior para explorar Películas y Series.</p>
              </div>
            </div>

            <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-4">Consejos</h2>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>• Crea hasta 4 perfiles desde el selector de perfil.</li>
                <li>• Cambia de perfil desde el botón "Cambiar cuenta" en la pantalla de selección.</li>
                <li>• Usa el buscador para buscar títulos o actores específicos.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
