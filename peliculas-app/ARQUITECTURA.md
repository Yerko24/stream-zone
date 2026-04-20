# 🏗️ ARQUITECTURA DE STREAM ZONE

## 📐 Estructura del Proyecto

```
peliculas-app/
│
├── 📁 app/                          # Rutas de Next.js
│   ├── page.tsx                     # HOME (Dashboard principal)
│   ├── layout.tsx                   # Layout global
│   ├── globals.css                  # Estilos globales
│   │
│   ├── 📁 login/
│   │   └── page.tsx                 # Página de login
│   │
│   ├── 📁 register/
│   │   └── page.tsx                 # Página de registro
│   │
│   └── 📁 profile-selector/         # ✨ NUEVO
│       └── page.tsx                 # Selector de perfiles
│
├── 📁 components/                   # Componentes reutilizables
│   ├── Navbar.tsx                   # Navbar principal
│   ├── MovieCard.tsx                # Card de película
│   ├── MovieRow.tsx                 # ✨ Fila scrolleable
│   ├── SearchBar.tsx                # Buscador
│   ├── TrailerModal.tsx             # ✨ Modal de trailers
│   ├── ProfileSelector.tsx          # ✨ Selector de perfiles
│   ├── LoginForm.tsx                # Formulario login
│   └── SignupForm.tsx               # Formulario registro
│
├── 📁 contexts/                     # Context API
│   └── AuthContext.tsx              # Estado global auth + perfiles
│
└── 📁 public/
    └── app.png                      # Fondo de la app
```

---

## 🔌 Flujo de Datos (Data Flow)

```
┌─────────────────────────────────────────────────────────────┐
│                     CONTEXTO GLOBAL                          │
│                    (AuthContext.tsx)                         │
│                                                              │
│  - isLoggedIn: boolean                                       │
│  - userEmail: string | null                                 │
│  - perfiles: Perfil[]                ← ✨ NUEVO            │
│  - perfilActual: Perfil | null       ← ✨ NUEVO            │
│  - crearPerfil()                     ← ✨ NUEVO            │
│  - seleccionarPerfil()               ← ✨ NUEVO            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
           ↓ useAuth() hook ↓
       (Usado en todos los componentes)
           ↓              ↓
    ┌──────────────┐  ┌──────────────┐
    │  Navbar.tsx  │  │  page.tsx    │
    │  (Lee datos) │  │  (Lee datos) │
    └──────────────┘  └──────────────┘
```

---

## 🎭 Componentes y Sus Responsabilidades

```
COMPONENTES
│
├── 🎬 MovieCard.tsx
│   ├── Props: { movie: Movie }
│   ├── Estado: showTrailer (boolean)
│   ├── Usa: TrailerModal
│   └── Renderiza: Card con poster + botón
│
├── 🎞️ MovieRow.tsx
│   ├── Props: { titulo: string, peliculas: Movie[] }
│   ├── Estado: scrollContainerRef
│   ├── Funciones: scroll(left|right)
│   └── Renderiza: Fila scrolleable + botones navegación
│
├── 🎥 TrailerModal.tsx (✨ NUEVO)
│   ├── Props: { isOpen, movieTitle, onClose }
│   ├── Efecto: Obtiene trailer de YouTube
│   └── Renderiza: Modal con iframe
│
├── 👤 ProfileSelector.tsx (✨ NUEVO)
│   ├── Props: { onProfileSelected }
│   ├── Estado: nuevoNombre, mostrarFormulario
│   ├── Funciones: handleCrearPerfil, handleSeleccionarPerfil
│   └── Renderiza: Grid de perfiles + formulario
│
├── 🔍 SearchBar.tsx
│   ├── Props: { search, setSearch, onSearch, loading }
│   └── Renderiza: Input + botón búsqueda
│
├── 📱 Navbar.tsx (MEJORADO)
│   ├── Lee: isLoggedIn, perfilActual
│   ├── Funciones: handleLogout()
│   └── Renderiza: Navbar con perfil actual
│
├── 🔐 LoginForm.tsx
│   ├── Estado: email, password, error, loading
│   ├── Usa: useAuth() para login
│   └── Renderiza: Formulario login
│
└── 📝 SignupForm.tsx
    ├── Estado: email, password, confirmPassword, error
    ├── Usa: useAuth() para register
    └── Renderiza: Formulario registro
```

---

## 📊 Rutas y Flujo de Navegación

```
START
  │
  ├─→ / (home)
  │   └─→ isLoggedIn? 
  │       ├─ YES → Muestra HOME con MovieRows
  │       └─ NO  → Redirige a /login
  │
  ├─→ /login
  │   └─→ Envía credenciales
  │       ├─ VÁLIDO → isLoggedIn = true
  │       │           → Redirige a /profile-selector
  │       └─ INVÁLIDO → Muestra error
  │
  ├─→ /register (✨)
  │   └─→ Crea usuario nuevo
  │       ├─ ÉXITO → Redirige a /login
  │       └─ ERROR → Muestra error
  │
  └─→ /profile-selector (✨ NUEVO)
      └─→ isLoggedIn?
          ├─ YES → Selecciona perfil
          │        → Redirige a /
          └─ NO  → Redirige a /login
```

---

## 🔄 Ciclo de Vida de la Aplicación

```
1. MOUNT INICIAL
   └─ AuthContext verifica localStorage
      ├─ ¿Sesión activa?
      │  ├─ SÍ → Carga usuario y perfiles
      │  └─ NO → isLoggedIn = false
      └─ setIsLoggedIn, setUserEmail, setPerfiles

2. USER INTENTA ACCEDER A /
   ├─ useEffect verifica isLoggedIn
   │  ├─ false → Redirige a /login
   │  └─ true → Carga contenido
   │
   └─ useEffect dispara loadAutomaticContent()
      ├─ 8 búsquedas en paralelo a OMDb
      ├─ Llena 4 categorías de películas
      └─ Renderiza MovieRows

3. USER HACE CLICK EN PELÍCULA
   ├─ setShowTrailer(true)
   └─ TrailerModal se abre
      ├─ Busca trailer en YouTube
      └─ Renderiza iframe

4. USER LOGOUT
   ├─ Borra localStorage
   ├─ Reset de estado
   └─ Redirige a /login
```

---

## 🌐 Flujo de API

```
┌────────────────────────────────────────────┐
│           OMDb API                         │
│   API_KEY: 64ef769b                        │
└────────────────────────────────────────────┘
           ↑
           │ fetch()
           │
┌────────────────────────────────────────────┐
│      loadAutomaticContent()                │
│      (app/page.tsx)                        │
│                                            │
│  Promise.all([                             │
│    fetch("...avengers..."),                │
│    fetch("...batman..."),                  │
│    fetch("...game of thrones..."),         │
│    ...                                     │
│  ])                                        │
│      │                                     │
│      ↓                                     │
│  setTop10Peliculas([...])                  │
│  setTop10Series([...])                     │
│  setTendencias([...])                      │
│  setPopulares([...])                       │
└────────────────────────────────────────────┘
           ↓
      MovieRow renderiza
           ↓
      MovieCard renderiza
```

---

## 💾 localStorage Schema

```javascript
{
  // Usuarios (global)
  "streamzone-usuarios": [
    { email: "admin@streamzone.com", password: "123456" },
    { email: "user@example.com", password: "hashedPassword" }
  ],

  // Sesión actual
  "streamzone-session": "true",
  "streamzone-user-email": "admin@streamzone.com",

  // Perfiles por usuario
  "streamzone-perfiles-admin@streamzone.com": [
    { id: "perfil-1", nombre: "Mi Perfil", email: "admin@streamzone.com" },
    { id: "perfil-1234567890", nombre: "Familia", email: "admin@streamzone.com" }
  ],

  // Perfil actual
  "streamzone-perfil-actual-admin@streamzone.com": {
    id: "perfil-1",
    nombre: "Mi Perfil",
    email: "admin@streamzone.com"
  }
}
```

---

## 🎨 Estilo y Theming

```javascript
// Tailwind CSS Classes
Dark Mode: {
  bg-black,           // #000000
  bg-gray-900,        // #111111
  bg-gray-800,        // #1f2937
  text-white,         // #ffffff
  text-gray-300,      // #d1d5db
}

Acentos: {
  blue-600,          // #2563eb (primario)
  red-600,           // #dc2626 (logout)
  purple-600,        // #9333ea (gradientes)
}

Efectos: {
  backdrop-blur,
  shadow-lg,
  hover:scale-110,
  transition-all,
  duration-300,
}
```

---

## 🔐 Seguridad

```
1. Rutas protegidas
   ├─ Verificar isLoggedIn en useEffect
   ├─ Redirigir a /login si no logueado
   └─ Evitar acceso sin autenticación

2. Datos sensibles
   ├─ NO guardar passwords sin hash (demo)
   ├─ Sesión en localStorage (OK para demo)
   └─ En producción → JWT + HttpOnly cookies

3. Validaciones
   ├─ Email válido
   ├─ Contraseña mínimo 6 caracteres
   ├─ Emails únicos
   └─ Perfiles sin duplicados
```

---

## 📦 Dependencias

```json
{
  "dependencies": {
    "next": "16.2.4",
    "react": "19",
    "react-dom": "19",
    "tailwindcss": "4"
  },
  "devDependencies": {
    "typescript": "5",
    "@types/react": "19",
    "@types/node": "latest"
  }
}
```

---

## 🚀 Performance Optimizations

```
✅ Code Splitting (Next.js automático)
✅ Image Optimization (Tailwind CSS)
✅ CSS Utilities (Tailwind, no inline)
✅ Lazy Loading (Componentes dinámicos)
✅ Context API (No Redux)
✅ Memoization (Componentes puros)
✅ Smooth Scrolling (CSS nativo)
✅ Debouncing (Búsqueda manual)
```

---

## 📈 Escalabilidad

```
Actual:
- localStorage (Demo)
- 1 usuario
- Películas mockup

Escalable a:
- Backend con Node.js + PostgreSQL
- JWT para autenticación
- Base de datos de usuarios
- API real de películas
- Favoritos y watchlist
- Recomendaciones ML
- Analytics
```

---

## 🎯 Estructura del Código

```
Componentes de Presentación (Dumb)
├─ MovieCard
├─ MovieRow
├─ TrailerModal
├─ SearchBar
├─ Navbar
└─ ProfileSelector

Componentes de Lógica (Smart)
├─ page.tsx (Home)
├─ LoginForm
├─ SignupForm
└─ ProfileSelector

Estado Global (Context)
└─ AuthContext
   ├─ isLoggedIn
   ├─ userEmail
   ├─ perfiles
   ├─ perfilActual
   ├─ login()
   ├─ logout()
   ├─ register()
   ├─ crearPerfil()
   └─ seleccionarPerfil()
```

---

## 🎓 Patrones Utilizados

```
✅ Container Pattern (pages usan context)
✅ Presentational Pattern (componentes puros)
✅ Custom Hooks (useAuth)
✅ Context API (Global state)
✅ Controlled Components (Form inputs)
✅ Conditional Rendering
✅ Array Methods (map, filter, find)
✅ Async/Await (Fetch)
```

---

## 🌟 Puntos Destacados

1. **MovieRow scrolleable** - UX tipo Netflix
2. **ProfileSelector** - Interfaz elegante
3. **TrailerModal automático** - Sin configuración
4. **Múltiples perfiles** - Por usuario
5. **Responsive** - Mobile/Tablet/Desktop
6. **Dark mode profesional** - Glassmorphism
7. **Código limpio** - Fácil de mantener
8. **Componentes modulares** - Reutilizables

---

## 💡 Próximas Mejoras

```
Corto plazo:
- [ ] Agregar loading skeleton
- [ ] Mejorar búsqueda (debounce)
- [ ] Agregar filtros
- [ ] Favorites/Watchlist

Mediano plazo:
- [ ] Backend API
- [ ] Autenticación real
- [ ] Base de datos
- [ ] Pagina de detalle de película

Largo plazo:
- [ ] Recomendaciones ML
- [ ] Social features
- [ ] Streaming real
- [ ] Analytics
```

---

**Documentación de Arquitectura - Stream Zone**  
*Diseño modular, escalable y profesional*
