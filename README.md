# UnaHur Anti-Social Net – Frontend

Trabajo Práctico 2 de **Construcción de Interfaces de Usuario** (UNaHur).

Frontend en React + TypeScript de la red social "UnaHur Anti-Social Net". Permite navegar publicaciones, ver su detalle con comentarios, registrarse, iniciar sesión (login simulado) y crear publicaciones con imágenes y etiquetas.

## Tecnologías

- React + TypeScript (Vite)
- React Router DOM (navegación y rutas protegidas)
- React Bootstrap / Bootstrap 5 (diseño responsive)
- Context API (`useContext`) + `localStorage` para la sesión
- `fetch` con `async/await` para consumir la API REST

## Funcionalidades

- **Login simulado:** se verifica que el nickName exista con `GET /users` y la contraseña fija es `123456`. El usuario se guarda en un contexto global y en `localStorage`.
- **Registro:** formulario con validaciones (campos obligatorios y formato de email). Envía `POST /users` y muestra el error del backend si el nickName ya existe.
- **Home:** banner de bienvenida y feed con imagen, autor, fecha, descripción, etiquetas, cantidad de comentarios y botón "Ver más".
- **Detalle (`/post/:id`):** descripción, imágenes, etiquetas, comentarios visibles con su autor y formulario para comentar.
- **Perfil (ruta protegida):** datos del usuario, sus publicaciones con cantidad de comentarios y botón para cerrar sesión.
- **Crear publicación (ruta protegida):** descripción obligatoria, una o más URLs de imágenes (una por línea o separadas por coma) y selección de etiquetas obtenidas de la API. Al publicar redirige al perfil.
- **Validaciones con feedback visual** en todos los formularios y alertas de error si falla la API.
- **Diseño propio y responsive:** paleta de colores del grupo, etiquetas de colores y navbar que se adapta al celular.

## API utilizada

Backend provisto por la cátedra: https://github.com/lucasfigarola/backend-api

URL de la API: **http://localhost:3001**

## Cómo correr el proyecto

### 1. Backend

```bash
git clone https://github.com/lucasfigarola/backend-api.git
cd backend-api
npm install
node seed.js     # crea la base con datos de ejemplo (solo la primera vez)
npm start        # http://localhost:3001
```

### 2. Frontend

```bash
git clone https://github.com/camilaparedes21/Interfaces-tp2.git
cd Interfaces-tp2
npm install
npm run dev      # http://localhost:5173
```

### Usuarios de prueba

Los crea el `seed.js` del backend: `luna` y `sol`. La contraseña es `123456`.

## Estructura del proyecto

```
src/
├── components/   # Navbar, PostCard, ProtectedRoute
├── context/      # AuthContext (usuario logueado)
├── pages/        # Home, Login, Register, PostDetail, Profile, CreatePost
├── services/     # api.ts: todas las llamadas a la API
└── types/        # tipos de TypeScript (User, Post, Comment, Tag, PostImage)
```

## Integrantes – Grupo 9

- Alexander Bazan 
- Leandro Joaquin Moreno
- Fabian Ricardo Blanco
- Camila Belen Paredes 
- Pedro Covetta