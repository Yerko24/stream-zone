"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { isLoggedIn, logout, perfilActual } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // 🔥 CLAVE

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/peliculas", label: "Películas" },
    { href: "/series", label: "Series" },
    { href: "/favoritos", label: "Favoritos" },
    { href: "/perfil", label: "Perfil" },
  ];

  const getLinkClass = (href: string) => {
    const active =
      pathname === href ||
      (href !== "/" && pathname?.startsWith(href));

    return `text-sm font-medium transition-colors ${
      active
        ? "text-white underline underline-offset-8 decoration-red-500"
        : "text-gray-300 hover:text-white"
    }`;
  };

  return (
    <nav className="bg-black/90 backdrop-blur-md border-b border-gray-800 px-4 py-4 fixed top-0 w-full z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">

        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-3xl">🎬</span>
          <h1 className="text-2xl font-bold text-white hidden sm:block">
            Stream Zone
          </h1>
        </Link>

        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={getLinkClass(item.href)}>
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {isLoggedIn && perfilActual && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-800/60 px-4 py-2 rounded-full border border-gray-700">
              <span className="text-lg">👤</span>
              <span className="text-gray-200 text-sm font-medium">
                {perfilActual.nombre}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-lg"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}