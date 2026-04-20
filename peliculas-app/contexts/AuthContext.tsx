"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Tipos
interface Usuario {
  email: string;
  password: string;
}

interface Perfil {
  id: string;
  nombre: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string) => { success: boolean; message: string };
  userEmail: string | null;
  perfiles: Perfil[];
  perfilActual: Perfil | null;
  crearPerfil: (nombre: string, email: string) => Perfil;
  seleccionarPerfil: (perfil: Perfil) => void;
  editarPerfil: (perfilId: string, nuevoNombre: string) => void;
  cambiarContrasena: (currentPassword: string, newPassword: string) => { success: boolean; message: string };

  // 🔥 FAVORITOS
  favorites: string[];
  toggleFavorite: (movieId: string) => void;
  isFavorite: (movieId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock
const MOCK_EMAIL = "admin@streamzone.com";
const MOCK_PASSWORD = "123456";

// Keys
const USUARIOS_STORAGE_KEY = "streamzone-usuarios";
const SESSION_STORAGE_KEY = "streamzone-session";
const USER_EMAIL_STORAGE_KEY = "streamzone-user-email";
const PERFILES_STORAGE_KEY = "streamzone-perfiles";
const PERFIL_ACTUAL_STORAGE_KEY = "streamzone-perfil-actual";
const FAVORITES_STORAGE_KEY = "streamzone-favorites";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session === "true";
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(USER_EMAIL_STORAGE_KEY);
  });
  const [perfiles, setPerfiles] = useState<Perfil[]>(() => {
    if (typeof window === 'undefined') return [];
    const email = localStorage.getItem(USER_EMAIL_STORAGE_KEY);
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    if (session === "true" && email) {
      const perfilesGuardados = localStorage.getItem(`${PERFILES_STORAGE_KEY}-${email}`);
      const perfilesData: Perfil[] = perfilesGuardados ? JSON.parse(perfilesGuardados) : [];
      if (perfilesData.length === 0) {
        const perfilPorDefecto: Perfil = {
          id: "perfil-1",
          nombre: "Mi Perfil",
          email
        };
        perfilesData.push(perfilPorDefecto);
        localStorage.setItem(`${PERFILES_STORAGE_KEY}-${email}`, JSON.stringify(perfilesData));
      }
      return perfilesData;
    }
    return [];
  });
  const [perfilActual, setPerfilActual] = useState<Perfil | null>(() => {
    if (typeof window === 'undefined') return null;
    const email = localStorage.getItem(USER_EMAIL_STORAGE_KEY);
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    if (session === "true" && email) {
      const perfilesGuardados = localStorage.getItem(`${PERFILES_STORAGE_KEY}-${email}`);
      const perfilesData: Perfil[] = perfilesGuardados ? JSON.parse(perfilesGuardados) : [];
      const perfilActualGuardado = localStorage.getItem(`${PERFIL_ACTUAL_STORAGE_KEY}-${email}`);
      return perfilActualGuardado ? JSON.parse(perfilActualGuardado) : perfilesData[0] || null;
    }
    return null;
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const email = localStorage.getItem(USER_EMAIL_STORAGE_KEY);
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    if (session === "true" && email) {
      const favoritesGuardados = localStorage.getItem(`${FAVORITES_STORAGE_KEY}-${email}`);
      return favoritesGuardados ? JSON.parse(favoritesGuardados) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const usuariosGuardados = localStorage.getItem(USUARIOS_STORAGE_KEY);
      if (!usuariosGuardados) {
        const usuariosIniciales: Usuario[] = [
          { email: MOCK_EMAIL, password: MOCK_PASSWORD }
        ];
        localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuariosIniciales));
      }
    } catch (error) {
      console.error("Error initializing auth state:", error);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      const usuariosGuardados = localStorage.getItem(USUARIOS_STORAGE_KEY);
      const usuarios: Usuario[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

      const usuarioValido = usuarios.find(u => u.email === email && u.password === password);

      if (usuarioValido) {
        setIsLoggedIn(true);
        setUserEmail(email);
        localStorage.setItem(SESSION_STORAGE_KEY, "true");
        localStorage.setItem(USER_EMAIL_STORAGE_KEY, email);

        const perfilesGuardados = localStorage.getItem(`${PERFILES_STORAGE_KEY}-${email}`);
        const perfilesData: Perfil[] = perfilesGuardados ? JSON.parse(perfilesGuardados) : [];

        if (perfilesData.length === 0) {
          const perfilPorDefecto: Perfil = {
            id: "perfil-1",
            nombre: "Mi Perfil",
            email
          };
          perfilesData.push(perfilPorDefecto);
          localStorage.setItem(`${PERFILES_STORAGE_KEY}-${email}`, JSON.stringify(perfilesData));
        }

        setPerfiles(perfilesData);

        const perfilAct = perfilesData[0];
        setPerfilActual(perfilAct);
        localStorage.setItem(`${PERFIL_ACTUAL_STORAGE_KEY}-${email}`, JSON.stringify(perfilAct));

        const favoritesGuardados = localStorage.getItem(`${FAVORITES_STORAGE_KEY}-${email}`);
        const favs = favoritesGuardados ? JSON.parse(favoritesGuardados) : [];
        setFavorites(favs);

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const register = (email: string, password: string) => {
    if (typeof window === 'undefined') return { success: false, message: "No disponible en servidor" };

    try {
      if (!email || !password) {
        return { success: false, message: "Email y contraseña requeridos" };
      }

      if (!email.includes("@")) {
        return { success: false, message: "Email inválido" };
      }

      if (password.length < 6) {
        return { success: false, message: "Mínimo 6 caracteres" };
      }

      const usuariosGuardados = localStorage.getItem(USUARIOS_STORAGE_KEY);
      const usuarios: Usuario[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

      if (usuarios.some(u => u.email === email)) {
        return { success: false, message: "Ya existe" };
      }

      usuarios.push({ email, password });
      localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuarios));

      return { success: true, message: "Registro exitoso" };
    } catch {
      return { success: false, message: "Error" };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setPerfiles([]);
    setPerfilActual(null);
    setFavorites([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
    }
  };

  const crearPerfil = (nombre: string, email: string): Perfil => {
    const nuevoPerfil: Perfil = {
      id: `perfil-${Date.now()}`,
      nombre,
      email
    };

    const nuevos = [...perfiles, nuevoPerfil];
    setPerfiles(nuevos);
    if (typeof window !== 'undefined' && userEmail) {
      localStorage.setItem(`${PERFILES_STORAGE_KEY}-${userEmail}`, JSON.stringify(nuevos));
    }

    return nuevoPerfil;
  };

  const seleccionarPerfil = (perfil: Perfil) => {
    setPerfilActual(perfil);
    if (typeof window !== 'undefined' && userEmail) {
      localStorage.setItem(`${PERFIL_ACTUAL_STORAGE_KEY}-${userEmail}`, JSON.stringify(perfil));
    }
  };

  const editarPerfil = (perfilId: string, nuevoNombre: string) => {
    const actualizados = perfiles.map(p =>
      p.id === perfilId ? { ...p, nombre: nuevoNombre } : p
    );

    setPerfiles(actualizados);

    if (userEmail) {
      localStorage.setItem(`${PERFILES_STORAGE_KEY}-${userEmail}`, JSON.stringify(actualizados));
    }
  };

  const cambiarContrasena = (_currentPassword: string, _newPassword: string) => {
    void _currentPassword;
    void _newPassword;
    return { success: true, message: "Contraseña cambiada (demo)" };
  };

  // 🔥 FAVORITOS
  const toggleFavorite = (movieId: string) => {
    if (!userEmail) return;

    const nuevos = favorites.includes(movieId)
      ? favorites.filter(id => id !== movieId)
      : [...favorites, movieId];

    setFavorites(nuevos);
    localStorage.setItem(`${FAVORITES_STORAGE_KEY}-${userEmail}`, JSON.stringify(nuevos));
  };

  const isFavorite = (movieId: string) => {
    return favorites.includes(movieId);
  };

  console.log("VERSION NUEVA AUTH");
  return (
<AuthContext.Provider
value={{
  isLoggedIn,
  login,
  logout,
  register,
  userEmail,
  perfiles,
  perfilActual,
  crearPerfil,
  seleccionarPerfil,
  editarPerfil,
  cambiarContrasena,
  favorites,
  toggleFavorite,
  isFavorite
}}
>
  {children}
</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}