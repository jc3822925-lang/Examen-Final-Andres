# 📸 FotoAuth

**Estudiante:** Pablo __________________ — Carné: __________
**Curso:** __________________ — Universidad Mariano Gálvez de Guatemala

## Descripción

FotoAuth es una aplicación móvil desarrollada con **React Native, Expo y TypeScript** que permite a un usuario autenticado seleccionar fotografías desde la galería o capturarlas con la cámara del dispositivo.

Funcionamiento:

1. **Inicio de sesión** con correo electrónico y contraseña mediante **Supabase Auth**.
2. La **pantalla principal** solo es accesible cuando existe una sesión válida; en caso contrario se muestra el inicio de sesión.
3. La **sesión se mantiene** al cerrar y volver a abrir la app (persistida en `AsyncStorage` con renovación automática del token).
4. Desde la pantalla principal el usuario puede:
   - Seleccionar una fotografía de la **galería** (Expo Image Picker).
   - **Capturar** una fotografía con la cámara (se verifican y solicitan los permisos antes de abrirla).
   - Ver la fotografía en una **vista previa**.
   - **Cambiar** la fotografía seleccionando o capturando otra.
   - **Eliminar** la fotografía de la vista previa.
5. Opción para **cerrar sesión**.

## Estructura del proyecto

```
foto-auth-app/
├── App.tsx                      # Punto de entrada: providers + navegador raíz
├── app.json                     # Configuración de Expo y textos de permisos
├── .env.example                 # Variables de entorno de Supabase (plantilla)
├── docs/screenshots/            # Evidencias del funcionamiento
└── src/
    ├── lib/
    │   └── supabase.ts          # Cliente de Supabase con sesión persistente
    ├── services/
    │   ├── authService.ts       # Inicio/cierre de sesión y lectura de sesión
    │   └── imageService.ts      # Permisos, galería y cámara (Expo Image Picker)
    ├── context/
    │   └── AuthContext.tsx      # Estado global de autenticación (useAuth)
    ├── navigation/
    │   └── RootNavigator.tsx    # Protección de rutas según la sesión
    ├── screens/
    │   ├── LoadingScreen.tsx    # Verificación de sesión al iniciar
    │   ├── LoginScreen.tsx      # Formulario de inicio de sesión
    │   └── HomeScreen.tsx       # Pantalla principal (gestión de fotografía)
    ├── components/
    │   ├── PrimaryButton.tsx    # Botón reutilizable
    │   └── PhotoPreview.tsx     # Vista previa de la fotografía
    └── theme/
        └── colors.ts            # Paleta de colores
```

## Requisitos previos

- Node.js 20 o superior
- Aplicación **Expo Go** instalada en el teléfono (Android/iOS) o un emulador
- Un proyecto en [Supabase](https://supabase.com)

## Configuración de Supabase

1. Cree un proyecto en Supabase.
2. En **Authentication → Users → Add user → Create new user**, cree un usuario con correo y contraseña (marque *Auto Confirm User*).
3. En **Project Settings → API**, copie la *Project URL* y la *anon public key*.
4. En la raíz del proyecto cree el archivo `.env` a partir de la plantilla:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/USUARIO/foto-auth-app.git
cd foto-auth-app

# 2. Instalar dependencias
npm install

# 3. Ejecutar
npx expo start
```

Escanee el código QR con **Expo Go** (Android) o con la cámara (iOS). También puede usar:

```bash
npm run android   # emulador Android
npm run ios       # simulador iOS (macOS)
```

> La cámara solo funciona en un dispositivo físico; en los simuladores únicamente está disponible la galería.

Verificación de tipos:

```bash
npx tsc --noEmit
```

## Dependencias principales

| Paquete | Uso |
|---|---|
| `expo` (SDK 58) | Plataforma y herramientas de desarrollo |
| `react-native` | Framework de interfaz móvil |
| `typescript` | Tipado estático |
| `@supabase/supabase-js` | Autenticación con Supabase |
| `@react-native-async-storage/async-storage` | Persistencia de la sesión |
| `react-native-url-polyfill` | Compatibilidad de `URL` requerida por Supabase |
| `expo-image-picker` | Selección de galería, captura con cámara y permisos |
| `react-native-safe-area-context` | Manejo de áreas seguras (notch, barra de estado) |

## Evidencias

| Inicio de sesión | Pantalla principal |
|---|---|
| ![Login](docs/screenshots/01-login.png) | ![Principal](docs/screenshots/02-principal.png) |

| Selección desde galería | Uso de la cámara |
|---|---|
| ![Galería](docs/screenshots/03-galeria.png) | ![Cámara](docs/screenshots/04-camara.png) |

| Permiso de cámara | Fotografía eliminada / cierre de sesión |
|---|---|
| ![Permiso](docs/screenshots/05-permiso-camara.png) | ![Eliminar](docs/screenshots/06-eliminar.png) |
