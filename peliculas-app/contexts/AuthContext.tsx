"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Definir tipos
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
  favorites: string[];
  toggleFavorite: (movieId: string) => void;
  isFavorite: (movieId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credencial demo inicial
const MOCK_EMAIL = "admin@streamzone.com";
const MOCK_PASSWORD = "123456";

// Claves para localStorage
const USUARIOS_STORAGE_KEY = "streamzone-usuarios";
const SESSION_STORAGE_KEY = "streamzone-session";
const USER_EMAIL_STORAGE_KEY = "streamzone-user-email";
const PERFILES_STORAGE_KEY = "streamzone-perfiles";
const PERFIL_ACTUAL_STORAGE_KEY = "streamzone-perfil-actual";
const FAVORITES_STORAGE_KEY = "streamzone-favorites";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [perfilActual, setPerfilActual] = useState<Perfil | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Inicializar usuarios y perfiles al cargar
  useEffect(() => {
    // Inicializar usuarios
    const usuariosGuardados = localStorage.getItem(USUARIOS_STORAGE_KEY);
    if (!usuariosGuardados) {
      const usuariosIniciales: Usuario[] = [
        { email: MOCK_EMAIL, password: MOCK_PASSWORD }
      ];
      localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuariosIniciales));
    }

    // Verificar sesión
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    const email = localStorage.getItem(USER_EMAIL_STORAGE_KEY);
    
    if (session === "true" && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
      
      // Cargar perfiles para este usuario
      const perfilesGuardados = localStorage.getItem(`${PERFILES_STORAGE_KEY}-${email}`);
      const perfilesData: Perfil[] = perfilesGuardados ? JSON.parse(perfilesGuardados) : [];
      
      if (perfilesData.length === 0) {
        // Crear perfil por defecto
        const perfilPorDefecto: Perfil = {
          id: "perfil-1",
          nombre: "Mi Perfil",
          email: email
        };
        perfilesData.push(perfilPorDefecto);
        localStorage.setItem(`${PERFILES_STORAGE_KEY}-${email}`, JSON.stringify(perfilesData));
      }
      
      setPerfiles(perfilesData);
      
      // Cargar perfil actual
      const perfilActualGuardado = localStorage.getItem(`${PERFIL_ACTUAL_STORAGE_KEY}-${email}`);
      const perfilAct = perfilActualGuardado ? JSON.parse(perfilActualGuardado) : perfilesData[0];
      setPerfilActual(perfilAct);

      // Cargar favoritos
      const favoritesGuardados = localStorage.getItem(`${FAVORITES_STORAGE_KEY}-${email}`);
      const favs = favoritesGuardados ? JSON.parse(favoritesGuardados) : [];
      setFavorites(favs);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    try {
      const usuariosGuardados = localStorage.getItem(USUARIOS_STORAGE_KEY);
      const usuarios: Usuario[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

      const usuarioValido = usuarios.find(u => u.email === email && u.password === password);

      if (usuarioValido) {
        setIsLoggedIn(true);
        setUserEmail(email);
        localStorage.setItem(SESSION_STORAGE_KEY, "true");
        localStorage.setItem(USER_EMAIL_STORAGE_KEY, email);
        
        // Cargar o crear perfiles
        const perfilesGuardados = localStorage.getItem(`${PERFILES_STORAGE_KEY}-${email}`);
        let perfilesData: Perfil[] = perfilesGuardados ? JSON.parse(perfilesGuardados) : [];
        
        if (perfilesData.length === 0) {
          const perfilPorDefecto: Perfil = {
            id: "perfil-1",
            nombre: "Mi Perfil",
            email: email
          };
          perfilesData.push(perfilPorDefecto);
          localStorage.setItem(`${PERFILES_STORAGE_KEY}-${email}`, JSON.stringify(perfilesData));
        }
        
        setPerfiles(perfilesData);
        const perfilAct = perfilesData[0];
        setPerfilActual(perfilAct);
        localStorage.setItem(`${PERFIL_ACTUAL_STORAGE_KEY}-${email}`, JSON.stringify(perfilAct));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const register = (email: string, password: string): { success: boolean; message: string } => {
    try {
      if (!email || !password) {
        return { success: false, message: "Email y contraseña son requeridos" };
      }

      if (email.length < 5 || !email.includes("@")) {
        return { success: false, message: "Email inválido" };
      }

      if (password.length < 6) {
        return { success: false, message: "La contraseña debe tener al menos 6 caracteres" };
      }

      const usuariosGuardados = localStorage.getItem(USUARIOS_STORAGE_KEY);
      const usuarios: Usuario[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

      if (usuarios.some(u => u.email === email)) {
        return { success: false, message: "Este email ya está registrado" };
      }

      usuarios.push({ email, password });
      localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuarios));

      return { success: true, message: "Registro exitoso. Ahora puedes iniciar sesión" };
    } catch (error) {
      console.error("Error en registro:", error);
      return { success: false, message: "Error al registrar usuario" };
    }
  };

  const crearPerfil = (nombre: string, email: string): Perfil => {
    const nuevoId = `perfil-${Date.now()}`;
    const nuevoPerfil: Perfil = {
      id: nuevoId,
      nombre,
      email,
    };

    const perfilesActualizados = [...perfiles, nuevoPerfil];
    setPerfiles(perfilesActualizados);
    localStorage.setItem(`${PERFILES_STORAGE_KEY}-${email}`, JSON.stringify(perfilesActualizados));

    return nuevoPerfil;
  };

  const seleccionarPerfil = (perfil: Perfil) => {
    setPerfilActual(perfil);
    if (userEmail) {
      localStorage.setItem(`${PERFIL_ACTUAL_STORAGE_KEY}-${userEmail}`, JSON.stringify(perfil));
    }
  };

  const editarPerfil = (perfilId: string, nuevoNombre: string) => {
    const perfilesActualizados = perfiles.map((perfil) =>
      perfil.id === perfilId ? { ...perfil, nombre: nuevoNombre } : perfil
    );

    setPerfiles(perfilesActualizados);

    if (userEmail) {
      localStorage.setItem(`${PERFILES_STORAGE_KEY}-${userEmail}`, JSON.stringify(perfilesActualizados));
    }

    if (perfilActual?.id === perfilId) {
      const perfilActualizado = { ...perfilActual, nombre: nuevoNombre };
      setPerfilActual(perfilActualizado);
      if (userEmail) {
        localStorage.setItem(`${PERFIL_ACTUAL_STORAGE_KEY}-${userEmail}`, JSON.stringify(perfilActualizado));
      }
    }
  };

  const cambiarContrasena = (currentPassword: string, newPassword: string): { success: boolean; message: string } => {
    if (!userEmail) {
      return { success: false, message: "No se ha encontrado el usuario activo" };
    }

    if (newPassword.length < 6) {
      return { success: false, message: "La contraseña debe tener al menos 6 caracteres" };
    }

    const usuariosGuardados = localStorage.getItem(USUARIOS_STORAGE_KEY);
    const usuarios: Usuario[] = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

    const usuarioIndex = usuarios.findIndex((u) => u.email === userEmail);

    if (usuarioIndex === -1) {
      return { success: false, message: "Usuario no encontrado" };
    }

    if (usuarios[usuarioIndex].password !== currentPassword) {
      return { success: false, message: "La contraseña actual es incorrecta" };
    }

    usuarios[usuarioIndex].password = newPassword;
    localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuarios));

    return { success: true, message: "Contraseña actualizada con éxito" };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setPerfiles([]);
    setPerfilActual(null);
    setFavorites([]);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
  };

  const toggleFavorite = (movieId: string) => {
    if (!userEmail) return;

    const newFavorites = favorites.includes(movieId)
      ? favorites.filter(id => id !== movieId)
      : [...favorites, movieId];

    setFavorites(newFavorites);
    localStorage.setItem(`${FAVORITES_STORAGE_KEY}-${userEmail}`, JSON.stringify(newFavorites));
  };

  const isFavorite = (movieId: string): boolean => {
    return favorites.includes(movieId);
  };

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