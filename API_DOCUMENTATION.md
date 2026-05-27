# 📚 DOCUMENTACIÓN DE API - MiniApp Biblioteca

## Información General

- **Base URL**: `http://localhost:5000`
- **Versión**: 1.0
- **Contenido**: JSON
- **Autenticación**: No requerida (agregar en futuras versiones)

---

## LIBROS - Endpoints

### 1. Obtener todos los libros
```http
GET /api/libros
```

**Ejemplo de respuesta:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "idLibro": "LIB001",
    "nombre": "El Quijote",
    "editorial": "Penguin",
    "autor": "Miguel de Cervantes",
    "numCopias": 5,
    "fechaIngreso": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### 2. Obtener un libro específico
```http
GET /api/libros/:id
```

**Parámetro:**
- `id`: ID de MongoDB del libro (ej: `507f1f77bcf86cd799439011`)

**Ejemplo de respuesta:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "idLibro": "LIB001",
  "nombre": "El Quijote",
  "editorial": "Penguin",
  "autor": "Miguel de Cervantes",
  "numCopias": 5,
  "fechaIngreso": "2024-01-15T10:30:00Z"
}
```

---

### 3. Crear nuevo libro
```http
POST /api/libros
Content-Type: application/json

{
  "idLibro": "LIB002",
  "nombre": "1984",
  "editorial": "Signet",
  "autor": "George Orwell",
  "numCopias": 3
}
```

**Respuesta (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "idLibro": "LIB002",
  "nombre": "1984",
  "editorial": "Signet",
  "autor": "George Orwell",
  "numCopias": 3,
  "fechaIngreso": "2024-01-15T11:00:00Z"
}
```

**Errores:**
- `400`: Faltan campos obligatorios o idLibro ya existe
- `500`: Error interno del servidor

---

### 4. Actualizar un libro
```http
PUT /api/libros/:id
Content-Type: application/json

{
  "nombre": "1984 - Edición revisada",
  "numCopias": 5,
  "editorial": "Signet",
  "autor": "George Orwell"
}
```

**Nota:** No puedes cambiar `idLibro` (es la clave única)

**Respuesta (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "idLibro": "LIB002",
  "nombre": "1984 - Edición revisada",
  "editorial": "Signet",
  "autor": "George Orwell",
  "numCopias": 5,
  "fechaIngreso": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T14:30:00Z"
}
```

---

### 5. Eliminar un libro
```http
DELETE /api/libros/:id
```

**Respuesta (200 OK):**
```json
{
  "mensaje": "Libro eliminado correctamente",
  "libro": {
    "_id": "507f1f77bcf86cd799439012",
    "idLibro": "LIB002",
    "nombre": "1984"
  }
}
```

---

## EVIDENCIAS - Endpoints

### 1. Obtener todas las evidencias
```http
GET /api/evidencias
```

**Parámetros opcionales (query string):**
- `?estudiante=Juan` - Filtrar por estudiante
- `?tipo=Informe` - Filtrar por tipo (Informe, Proyecto, Bitácora)
- `?estado=Pendiente` - Filtrar por estado

**Ejemplo:**
```http
GET /api/evidencias?estudiante=Juan&tipo=Informe&estado=Pendiente
```

**Respuesta:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "estudiante": "Juan",
    "tipo": "Informe",
    "nombre": "Informe Final Matemáticas",
    "descripcion": "Análisis de funciones trigonométricas",
    "estado": "Pendiente",
    "fechaCarga": "2024-01-15T15:00:00Z",
    "archivo": {
      "nombre": "informe.pdf",
      "url": "https://storage.example.com/informe.pdf",
      "tipo": "application/pdf",
      "tamaño": 2048000
    }
  }
]
```

---

### 2. Obtener una evidencia específica
```http
GET /api/evidencias/:id
```

**Parámetro:**
- `id`: ID de MongoDB de la evidencia

---

### 3. Crear nueva evidencia
```http
POST /api/evidencias
Content-Type: application/json

{
  "estudiante": "Juan",
  "tipo": "Informe",
  "nombre": "Informe Final Matemáticas",
  "descripcion": "Análisis de funciones trigonométricas",
  "archivo": {
    "nombre": "informe.pdf",
    "url": "https://storage.example.com/informe.pdf",
    "tipo": "application/pdf",
    "tamaño": 2048000
  }
}
```

**Campos requeridos:**
- `estudiante` (string)
- `tipo` (enum: "Informe", "Proyecto", "Bitácora")
- `nombre` (string, máx 200 caracteres)
- `descripcion` (string, máx 1000 caracteres, **OBLIGATORIO**)
- `archivo` (opcional)

**Respuesta (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "estudiante": "Juan",
  "tipo": "Informe",
  "nombre": "Informe Final Matemáticas",
  "descripcion": "Análisis de funciones trigonométricas",
  "estado": "Pendiente",
  "fechaCarga": "2024-01-15T16:00:00Z",
  "archivo": { /* ... */ }
}
```

---

### 4. Actualizar evidencia
```http
PUT /api/evidencias/:id
Content-Type: application/json

{
  "nombre": "Informe Final Matemáticas - Revisado",
  "descripcion": "Análisis de funciones trigonométricas con ejemplos",
  "estado": "Aprobada"
}
```

**Estados válidos:** `Pendiente`, `Revisada`, `Aprobada`, `Rechazada`

---

### 5. Eliminar evidencia
```http
DELETE /api/evidencias/:id
```

**Respuesta (200 OK):**
```json
{
  "mensaje": "Evidencia eliminada correctamente"
}
```

---

## Ejemplos de Uso desde JavaScript

### Obtener todos los libros
```javascript
fetch('http://localhost:5000/api/libros')
  .then(res => res.json())
  .then(libros => console.log(libros))
  .catch(err => console.error(err));
```

### Crear nuevo libro
```javascript
fetch('http://localhost:5000/api/libros', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idLibro: 'LIB003',
    nombre: 'Don Quijote',
    editorial: 'Penguin',
    autor: 'Cervantes',
    numCopias: 2
  })
})
.then(res => res.json())
.then(libro => console.log('Libro creado:', libro))
.catch(err => console.error(err));
```

### Actualizar libro
```javascript
fetch('http://localhost:5000/api/libros/507f1f77bcf86cd799439011', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Don Quijote - Edición de bolsillo',
    numCopias: 5
  })
})
.then(res => res.json())
.then(libro => console.log('Libro actualizado:', libro))
.catch(err => console.error(err));
```

### Eliminar libro
```javascript
fetch('http://localhost:5000/api/libros/507f1f77bcf86cd799439011', {
  method: 'DELETE'
})
.then(res => res.json())
.then(resultado => console.log(resultado))
.catch(err => console.error(err));
```

---

## Códigos de Respuesta HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | GET, PUT, DELETE exitoso |
| 201 | Created | POST exitoso (recurso creado) |
| 400 | Bad Request | Error en validación o datos inválidos |
| 404 | Not Found | Recurso no encontrado |
| 500 | Server Error | Error interno del servidor |

---

## Estructura de Carpetas

```
/MiniAppBiblioteca
├── config/
│   └── db.js              # Conexión MongoDB
├── models/
│   ├── Libro.js           # Esquema de Libro
│   └── Evidencia.js       # Esquema de Evidencia
├── routes/
│   ├── libros.js          # Endpoints /api/libros
│   └── evidencias.js      # Endpoints /api/evidencias
├── middleware/
│   └── errorHandler.js    # Manejo de errores centralizado
├── server.js              # Servidor principal
├── package.json           # Dependencias
├── .env                   # Variables de entorno
└── .env.example           # Plantilla de .env
```

---

## Próximos Pasos

1. Configurar MongoDB Atlas (ver `MONGODB_SETUP.md`)
2. Iniciar servidor: `npm start`
3. Actualizar frontend en `app.js` para usar estas APIs
4. Implementar carga de archivos con FormData
5. Agregar autenticación JWT en futuras versiones
