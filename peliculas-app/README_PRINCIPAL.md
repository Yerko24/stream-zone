# 🎬 STREAM ZONE - Plataforma de Streaming Tipo Netflix

> Una aplicación profesional de streaming de películas construida con Next.js, React, TypeScript y Tailwind CSS.

---

## 🚀 INICIO RÁPIDO

### Ejecutar la aplicación
```bash
cd peliculas-app
npm install  # Si aún no instalaste
npm run dev
```

### Acceder
```
http://localhost:3000
```

### Credenciales de prueba
```
Email:      admin@streamzone.com
Contraseña: 123456
```

---

## ✨ Características

- 🎬 **Home tipo Netflix** - 4 filas de películas scrolleables
- 👤 **Múltiples perfiles** - Hasta 4 perfiles por usuario
- 🎥 **Trailers integrados** - Búsqueda automática en YouTube
- 🔐 **Autenticación** - Login y registro de usuarios
- 📱 **Responsive** - Mobile, Tablet, Desktop
- 🎨 **Diseño profesional** - Dark mode tipo Netflix
- ✅ **32 películas automáticas** - Cargadas al iniciar

---

## 📚 Documentación

### Punto de Entrada
- **[RESUMEN_EJECUTIVO.md](RESUMEN_EJECUTIVO.md)** ← **EMPIEZA AQUÍ** (2 min)

### Guías por Necesidad
- **[INDICE.md](INDICE.md)** - Índice completo de documentación
- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Guía rápida de 5 minutos
- **[COMPARACION.md](COMPARACION.md)** - Visual antes vs después
- **[RESUMEN_FINAL.md](RESUMEN_FINAL.md)** - Visión general del proyecto
- **[ARQUITECTURA.md](ARQUITECTURA.md)** - Estructura técnica detallada
- **[IMPLEMENTACION.md](IMPLEMENTACION.md)** - Manual técnico de referencia

### Entrega
- **[ENTREGA.md](ENTREGA.md)** - Documento de entrega del proyecto

---

## 🎯 ¿Qué Necesitas?

### Solo probar la app
→ Lee **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)**

### Entender qué cambió
→ Lee **[COMPARACION.md](COMPARACION.md)**

### Detalles técnicos
→ Lee **[ARQUITECTURA.md](ARQUITECTURA.md)**

### Todo sobre el proyecto
→ Lee **[RESUMEN_FINAL.md](RESUMEN_FINAL.md)**

### Índice de todo
→ Lee **[INDICE.md](INDICE.md)**

---

## 🎬 Flujo de Uso

```
1. Login
   └─ admin@streamzone.com / 123456

2. Seleccionar Perfil
   └─ Elige un perfil o crea uno nuevo

3. Explorar Home
   ├─ 4 filas de películas
   ├─ Scroll horizontal
   └─ Botón "Ver Trailer"

4. Funcionalidades Adicionales
   ├─ Crear nuevos perfiles
   ├─ Buscar películas
   ├─ Ver trailers
   └─ Cambiar de perfil
```

---

## 📁 Estructura del Proyecto

```
peliculas-app/
├── app/
│   ├── page.tsx                    # Home
│   ├── login/page.tsx              # Login
│   ├── register/page.tsx           # Registro
│   ├── profile-selector/page.tsx   # Selector de perfiles
│   ├── layout.tsx                  # Layout
│   └── globals.css                 # Estilos
│
├── components/
│   ├── Navbar.tsx                  # Barra de navegación
│   ├── MovieCard.tsx               # Tarjeta de película
│   ├── MovieRow.tsx                # Fila de películas
│   ├── TrailerModal.tsx            # Modal de trailers
│   ├── ProfileSelector.tsx         # Selector de perfiles
│   ├── SearchBar.tsx               # Buscador
│   ├── LoginForm.tsx               # Formulario de login
│   └── SignupForm.tsx              # Formulario de registro
│
├── contexts/
│   └── AuthContext.tsx             # Contexto de autenticación
│
└── public/
    └── app.png                     # Imagen de fondo
```

---

## 🛠️ Stack Tecnológico

- **Next.js 16** - Framework React
- **React 18** - Librería UI
- **TypeScript** - Tipado de JavaScript
- **Tailwind CSS** - Framework de CSS
- **Context API** - Gestión de estado
- **OMDb API** - Base de datos de películas

---

## ✅ Funcionalidades Principales

### 🏠 Home
- 4 filas de películas scrolleables
- Contenido automático cargado
- Búsqueda manual integrada
- Responsive design

### 👤 Perfiles
- Crear hasta 4 perfiles por usuario
- Nombres personalizados
- Se guardan automáticamente
- Selector tipo Netflix

### 🎬 Películas
- 32 películas cargadas automáticamente
- Información: Poster, Título, Año
- Animaciones profesionales
- Tarjetas interactivas

### 🎥 Trailers
- Modal elegante
- YouTube integrado
- Búsqueda automática
- Fácil de cerrar

### 🔐 Autenticación
- Login funcional
- Registro con validaciones
- Sesión persistente
- Perfiles por usuario

---

## 📊 Características

| Feature | Status |
|---------|--------|
| Home tipo Netflix | ✅ |
| Filas scrolleables | ✅ |
| Múltiples perfiles | ✅ |
| Trailers integrados | ✅ |
| Autenticación | ✅ |
| Búsqueda | ✅ |
| Responsive | ✅ |
| Animaciones | ✅ |
| Documentación | ✅ |

---

## 🎨 Diseño

- **Tema:** Dark mode tipo Netflix
- **Colores:** Negro, Azul, Rojo, Gris
- **Animaciones:** Suaves y profesionales
- **Tipografía:** Moderna y legible
- **Efectos:** Glassmorphism, Sombras, Zooms

---

## 📱 Compatibilidad

- ✅ Desktop (> 1024px)
- ✅ Tablet (640px - 1024px)
- ✅ Mobile (< 640px)
- ✅ Chrome, Firefox, Safari, Edge

---

## 🚀 Deployment

Para deployar en producción:

1. **Vercel** (Recomendado)
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Netlify**
   - Conectar repo de Git
   - Build: `npm run build`
   - Output: `.next`

3. **Docker**
   - Ver configuración Docker

---

## 💡 Próximas Mejoras

- [ ] Backend con Node.js
- [ ] Base de datos PostgreSQL
- [ ] Autenticación con JWT
- [ ] Favoritos/Watchlist
- [ ] Recomendaciones personalizadas
- [ ] Sistema de calificaciones
- [ ] Página de detalles
- [ ] Sincronización en tiempo real

---

## 📝 Licencia

Proyecto de educación/portafolio. Libre para usar.

---

## 🙋 FAQ

**P: ¿Es completamente funcional?**  
R: Sí, todas las features funcionan. Es una versión demo.

**P: ¿Puedo modificar el código?**  
R: Claro, es tuyo. Está bien estructurado para cambios.

**P: ¿Puedo ponerlo en portafolio?**  
R: Sí, es profesional y listo para mostrar.

**P: ¿Cómo agrego más películas?**  
R: Modifica las búsquedas en `app/page.tsx`

**P: ¿Cómo cambio los colores?**  
R: Usa Tailwind en `globals.css` y componentes.

---

## 📞 Ayuda

¿Tienes dudas? Consulta:
1. **[INDICE.md](INDICE.md)** - Índice completo
2. **[ARQUITECTURA.md](ARQUITECTURA.md)** - Estructura del código
3. **[COMPARACION.md](COMPARACION.md)** - Ejemplos visuales

---

## 🌟 Créditos

Construido con ❤️ usando:
- Next.js
- React
- TypeScript
- Tailwind CSS
- OMDb API

---

## 📌 Inicio Recomendado

1. **Lee:** [RESUMEN_EJECUTIVO.md](RESUMEN_EJECUTIVO.md)
2. **Ejecuta:** `npm run dev`
3. **Accede:** http://localhost:3000
4. **Disfruta:** Prueba la aplicación

---

**Stream Zone - Plataforma de Streaming Profesional** ✨

*Última actualización: Abril 2025*
