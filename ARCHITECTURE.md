# 🏗️ ARQUITECTURA DEL SISTEMA - Con MongoDB

## Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────┐     │
│  │  index.html  │  │   style.css    │  │   app.js     │     │
│  │  (Estructura)│  │  (Estilos)     │  │  (Lógica UI) │     │
│  └──────────────┘  └────────────────┘  └──────────────┘     │
│                              ↑                                 │
│                              │                                 │
│                    ┌─────────────────┐                         │
│                    │ api-client.js   │                         │
│                    │ (HTTP Fetch)    │                         │
│                    └────────┬────────┘                         │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────┘
                              │ HTTP/JSON
                              │ (REST API)
                              ↓
                    ┌──────────────────┐
                    │  localhost:5000  │
                    │   Express.js     │
                    │   (server.js)    │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ↓                    ↓                    ↓
    ┌────────┐         ┌──────────┐        ┌─────────────┐
    │ Routes │         │ Middleware
    │        │         │          │        │ Validators  │
    ├────────┤         ├──────────┤        ├─────────────┤
    │ /libros│         │ CORS     │        │ Validar     │
    │        │         │          │        │ datos       │
    │/evidencias      │ Error    │        │ antes de    │
    │        │         │ Handler  │        │ guardar     │
    └────┬───┘         └──────────┘        └─────────────┘
         │
         ↓
    ┌──────────────┐
    │ Mongoose ORM │
    │ (Models)     │
    ├──────────────┤
    │  Libro.js    │
    │ Evidencia.js │
    └──────┬───────┘
           │
           ↓
    ┌───────────────────────┐
    │   MongoDB Atlas       │
    │   (Nube)              │
    ├───────────────────────┤
    │ Collections:          │
    │  - Libros             │
    │  - Evidencias         │
    └───────────────────────┘
```

---

## Flujo de Datos: Crear Libro

```
USUARIO
   │
   ├─ Rellena formulario
   │
   ↓
┌────────────────────────────┐
│ app.js - guardarLibroLib() │  (evento click en botón "Guardar")
├────────────────────────────┤
│ 1. Valida datos localmente  │
│ 2. Llama LibrosAPI.create() │
└────────┬───────────────────┘
         │
         ↓
┌────────────────────────────┐
│ api-client.js              │  (LibrosAPI.create())
├────────────────────────────┤
│ 1. Serializa JSON           │
│ 2. Envía POST a /api/libros │
└────────┬───────────────────┘
         │
         ↓ HTTP POST + JSON
         │
    localhost:5000
         │
         ↓
┌────────────────────────────┐
│ server.js - Express        │  (recibe POST)
├────────────────────────────┤
│ 1. Parsea JSON              │
│ 2. Middleware CORS          │
│ 3. Envía a router           │
└────────┬───────────────────┘
         │
         ↓
┌────────────────────────────┐
│ routes/libros.js           │  (POST /api/libros)
├────────────────────────────┤
│ 1. Extrae datos del body    │
│ 2. Valida obligatoriedad    │
│ 3. Crea objeto Libro        │
└────────┬───────────────────┘
         │
         ↓
┌────────────────────────────┐
│ models/Libro.js            │  (Mongoose Schema)
├────────────────────────────┤
│ 1. Valida tipos de datos    │
│ 2. Valida longitudes        │
│ 3. Valida rangos            │
│ 4. Prepara documento        │
└────────┬───────────────────┘
         │
         ↓
┌────────────────────────────┐
│ MongoDB Atlas              │  (guardar en BD)
├────────────────────────────┤
│ 1. Inserta documento        │
│ 2. Asigna _id único         │
│ 3. Confirma creación        │
└────────┬───────────────────┘
         │
         ↓ Respuesta 201 + JSON
         │
┌────────────────────────────┐
│ app.js                      │  (renderizar tabla)
├────────────────────────────┤
│ 1. Recibe nuevo libro con _id
│ 2. Llama renderTableLib()   │
│ 3. Actualiza tabla HTML     │
│ 4. Muestra mensaje éxito    │
└────────────────────────────┘
         │
         ↓
      USUARIO
      ┌──────────┐
      │ Ve nuevo │
      │  libro   │
      │ en tabla │
      └──────────┘
```

---

## Flujo de Datos: Obtener Libros (GET)

```
USUARIO abre navegador
│
├─ Página carga
│
├─ Se ejecuta initApp()
│
├─ Llama renderTableLib()
│
├─ renderTableLib() → LibrosAPI.getAll()
│
├─ fetch GET /api/libros
│
├─ Express recibe GET
│
├─ routes/libros.js ejecuta:
│   Libro.find()
│
├─ MongoDB retorna todos los documentos
│
├─ Express retorna JSON al navegador
│
├─ app.js recibe array de libros
│
├─ Itera sobre cada libro
│
├─ Crea filas HTML en tabla
│
└─ USUARIO ve tabla completa
```

---

## Estructura de Carpetas - Detallada

```
/MiniAppBiblioteca (Raíz del proyecto)
│
├── 📄 ARCHIVOS FRONTEND (Cliente)
│   ├── index.html              # Estructura HTML (sin cambios)
│   ├── style.css               # Estilos CSS (sin cambios)
│   ├── app.js                  # 🔄 NECESITA ACTUALIZACIÓN
│   ├── api-client.js           # ✅ NUEVO - Cliente HTTP
│   └── assets/                 # Logos e iconos
│       ├── icon-book.svg
│       └── logo.svg
│
├── ⚙️ ARCHIVOS DE CONFIGURACIÓN
│   ├── .env                    # 🔄 Variables de entorno (USAR TUYAS)
│   ├── .env.example            # Plantilla segura
│   ├── .gitignore              # ✅ NUEVO - Protege .env
│   ├── package.json            # ✅ ACTUALIZADO - Dependencias
│   └── package-lock.json       # Lock file de npm
│
├── 🔌 ARCHIVOS DEL SERVIDOR (Backend)
│   ├── server.js               # ✅ NUEVO - Servidor Express principal
│   │
│   ├── config/                 # Configuración
│   │   └── db.js               # ✅ NUEVO - Conexión MongoDB Mongoose
│   │
│   ├── models/                 # Esquemas Mongoose
│   │   ├── Libro.js            # ✅ NUEVO - Esquema de Libro
│   │   └── Evidencia.js        # ✅ NUEVO - Esquema de Evidencia
│   │
│   ├── routes/                 # Endpoints de la API
│   │   ├── libros.js           # ✅ NUEVO - GET, POST, PUT, DELETE /api/libros
│   │   └── evidencias.js       # ✅ NUEVO - GET, POST, PUT, DELETE /api/evidencias
│   │
│   └── middleware/             # Middlewares Express
│       └── errorHandler.js     # ✅ NUEVO - Manejo centralizado de errores
│
├── 📚 DOCUMENTACIÓN
│   ├── README.md               # Readme original
│   ├── README_BACKEND.md       # ✅ NUEVO - Documentación del backend
│   ├── QUICK_START.md          # ✅ NUEVO - Guía rápida
│   ├── MONGODB_SETUP.md        # ✅ NUEVO - Configuración MongoDB Atlas
│   ├── API_DOCUMENTATION.md    # ✅ NUEVO - Detalles de endpoints
│   ├── MIGRATION_GUIDE.md      # ✅ NUEVO - Cómo actualizar app.js
│   └── MANUAL_TECNICO.md       # Manual original (sin cambios)
│
└── node_modules/               # Dependencias instaladas (no subir a Git)
    └── (119+ paquetes)
```

---

## Dependencias del Proyecto

```
├── RUNTIME DEPENDENCIES
│   ├── express@4.18.2              # Framework web
│   ├── mongoose@8.0.0              # ODM para MongoDB
│   ├── cors@2.8.5                  # Control de acceso CORS
│   └── dotenv@16.3.1               # Variables de entorno
│
└── DEV DEPENDENCIES
    └── nodemon@3.0.2               # Auto-reinicia servidor en cambios
```

---

## Ciclo de Vida de una Solicitud HTTP

### Ejemplo: POST /api/libros

```
1. CLIENTE (navegador)
   ├─ usuario.click(btnGuardar)
   ├─ app.js: guardarLibroLib()
   ├─ api-client.js: LibrosAPI.create(libro)
   ├─ fetch POST /api/libros
   └─ Espera respuesta...

2. RED
   └─ HTTP POST request (JSON) → localhost:5000

3. SERVIDOR (Express)
   ├─ Recibe request en server.js
   ├─ Middleware: app.use(express.json()) parsea JSON
   ├─ Middleware: app.use(cors()) valida CORS
   ├─ Router dirige a routes/libros.js
   └─ Handler: router.post('/')

4. VALIDACIÓN
   ├─ routes/libros.js valida obligatoriedad
   ├─ Crea instancia de Libro
   ├─ models/Libro.js valida Schema:
   │  ├─ idLibro: string, required, unique, max 10
   │  ├─ nombre: string, required, max 100
   │  ├─ numCopias: number, min 1, max 999
   │  └─ etc...
   └─ Si hay error → Retorna 400

5. BASE DE DATOS
   ├─ Mongoose prepara documento
   ├─ MongoDB Atlas recibe INSERT
   ├─ Crea _id único (ObjectId)
   ├─ Guarda en colección "Libros"
   └─ Confirma ✅

6. RESPUESTA
   ├─ Retorna 201 Created
   ├─ Incluye documento con _id
   ├─ JSON → HTTP response
   └─ localhost:5000/api/libros

7. CLIENTE
   ├─ api-client.js recibe respuesta
   ├─ app.js recibe JSON con _id
   ├─ renderTableLib() actualiza tabla
   ├─ Muestra mensaje "Guardado correctamente"
   └─ Usuario ve nuevo libro en tabla
```

---

## Estados Posibles de una Operación

```
┌─────────────────────────────────────────┐
│         OPERACIÓN HTTP                   │
└────────────┬────────────────────────────┘
             │
        ┌────┴────┐
        ↓         ↓
    ┌──────┐  ┌──────┐
    │ Éxito│  │ Error│
    └───┬──┘  └───┬──┘
        │        │
        ├────────┼─────────┬──────────┬─────────┐
        ↓        ↓         ↓          ↓         ↓
      200      400       404        500      TIMEOUT
      (OK)   (Bad      (Not      (Server)
             Request)  Found)
             
      └─ Validación
         fallida
         
      └─ Registro
         no existe
         
      └─ Error
         en BD
         
      └─ Sin
         respuesta
```

---

## Checklist de Funcionalidad

### Backend
- [x] Express.js configurado
- [x] MongoDB Mongoose integrado
- [x] CORS habilitado
- [x] Rutas /api/libros completas (CRUD)
- [x] Rutas /api/evidencias completas (CRUD)
- [x] Validación en servidor
- [x] Manejo centralizado de errores
- [x] Variables de entorno con .env

### Frontend (Pendiente)
- [ ] Agregar <script src="api-client.js"> en HTML
- [ ] Actualizar app.js para usar LibrosAPI
- [ ] Actualizar app.js para usar EvidenciasAPI
- [ ] Cambiar localStorage por llamadas API
- [ ] Cambiar IDs a _id de MongoDB

### Documentación
- [x] README completo
- [x] Guía MongoDB Atlas
- [x] Documentación API
- [x] Guía de migración
- [x] Quick Start guide

---

## Próximos Pasos

```
┌──────────────────────────────────────┐
│ 1. CONFIGURAR MONGODB ATLAS          │
│    (Lee: MONGODB_SETUP.md)           │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│ 2. ACTUALIZAR .env                   │
│    (Agrega tu MongoDB URI)           │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│ 3. INICIAR SERVIDOR                  │
│    npm start                         │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│ 4. VERIFICAR /health                 │
│    curl http://localhost:5000/health │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│ 5. MIGRAR app.js                     │
│    (Lee: MIGRATION_GUIDE.md)         │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│ 6. PROBAR CRUD                       │
│    Crear/Leer/Actualizar/Eliminar   │
└──────────────────────────────────────┘
```

---

**¡Tu arquitectura full-stack está lista!** 🎉
