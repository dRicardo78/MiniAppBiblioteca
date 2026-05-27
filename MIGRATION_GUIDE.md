# 🔄 GUÍA DE MIGRACIÓN - Frontend a API

## Resumen del Cambio

**Antes:** Datos almacenados en `localStorage` (solo en navegador)  
**Después:** Datos en MongoDB (persistencia real)

## Cambios Principales

### 1. Agregar Script de API Client

En `index.html`, agrega antes de `app.js`:

```html
<script src="api-client.js"></script>
<script src="app.js"></script>
```

**Estructura en index.html:**
```html
<body>
  <!-- ... contenido HTML ... -->
  
  <script src="api-client.js"></script>      <!-- ← Agregar esto
  <script src="app.js"></script>            <!-- ← Ya existía
</body>
</html>
```

---

### 2. Módulo Biblioteca - Cambios Principales

**Antes (localStorage):**
```javascript
// app.js (línea ~250)
let libros = JSON.parse(localStorage.getItem('libros') || '[]');

function renderTableLib() {
  tableBodyLib.innerHTML = '';
  libros.forEach(book => { /* renderizar */ });
}

function guardarLibroLib() {
  libros.push(book);
  localStorage.setItem('libros', JSON.stringify(libros));
  renderTableLib();
}
```

**Después (API):**
```javascript
// app.js
let libros = [];

async function renderTableLib() {
  try {
    libros = await LibrosAPI.getAll();
    tableBodyLib.innerHTML = '';
    libros.forEach(book => { /* renderizar */ });
  } catch (error) {
    Utils.showError('Error al cargar libros: ' + error.message);
  }
}

async function guardarLibroLib() {
  try {
    const book = getFormDataLib();
    const nuevoLibro = await LibrosAPI.create(book);
    Utils.showSuccess('Libro guardado correctamente');
    renderTableLib();
    resetFormLib();
  } catch (error) {
    Utils.showError('Error al guardar: ' + error.message);
  }
}
```

---

### 3. Cambios en Cada Operación CRUD

#### **GET (Obtener libros)**
```javascript
// ANTES
let libros = JSON.parse(localStorage.getItem('libros') || '[]');

// DESPUÉS
libros = await LibrosAPI.getAll();
```

#### **POST (Crear libro)**
```javascript
// ANTES
libros.push(book);
localStorage.setItem('libros', JSON.stringify(libros));

// DESPUÉS
await LibrosAPI.create(book);
```

#### **PUT (Actualizar libro)**
```javascript
// ANTES
libros[index] = book;
localStorage.setItem('libros', JSON.stringify(libros));

// DESPUÉS
await LibrosAPI.update(libroId, updates);
```

#### **DELETE (Eliminar libro)**
```javascript
// ANTES
libros.splice(index, 1);
localStorage.setItem('libros', JSON.stringify(libros));

// DESPUÉS
await LibrosAPI.delete(libroId);
```

---

### 4. Módulo Evidencias - Cambios

Igual patrón que Biblioteca:

```javascript
// ANTES
let evidencias = JSON.parse(localStorage.getItem('evidencias') || '[]');
evidencias.push(nueva);
localStorage.setItem('evidencias', JSON.stringify(evidencias));

// DESPUÉS
await EvidenciasAPI.create(nueva);
libros = await EvidenciasAPI.getAll();  // Recargar tabla
```

---

## 📝 Paso a Paso: Actualizar app.js

### Paso 1: Inicializar datos al cargar la página

**Busca en app.js al final:**
```javascript
showSelector();
setDateNow();
renderTable();
```

**Reemplaza con:**
```javascript
async function initApp() {
  try {
    await renderTableLib();        // Cargar libros
    await renderTable();           // Cargar evidencias
    showSelector();
    setDateNow();
  } catch (error) {
    Utils.showError('Error inicializando aplicación');
  }
}

initApp();
```

---

### Paso 2: Actualizar funciones de Biblioteca

**Busca `guardarLibroLib()`** y reemplaza:

```javascript
async function guardarLibroLib() {
  const book = getFormDataLib();
  const error = validateBookLib(book);
  if (error) {
    showMessageLib(error);
    return;
  }

  try {
    if (selectedBookId && isEditing) {
      // Actualizar
      await LibrosAPI.update(selectedBookId, book);
      showMessageLib('Cambios guardados.');
    } else {
      // Crear
      await LibrosAPI.create(book);
      showMessageLib('Libro guardado correctamente.');
    }
    await renderTableLib();
    resetFormLib();
  } catch (error) {
    showMessageLib('Error: ' + error.message);
  }
}
```

**Busca `eliminarLibroLib()`** y reemplaza:

```javascript
async function eliminarLibroLib() {
  if (!selectedBookId) {
    showMessageLib('Selecciona un libro en la grilla para eliminarlo.');
    return;
  }

  const confirmDelete = confirm('¿Eliminar el libro seleccionado?');
  if (!confirmDelete) {
    showMessageLib('Eliminación cancelada.');
    return;
  }

  try {
    await LibrosAPI.delete(selectedBookId);
    showMessageLib('Libro eliminado correctamente.');
    resetFormLib();
    await renderTableLib();
  } catch (error) {
    showMessageLib('Error: ' + error.message);
  }
}
```

---

### Paso 3: Actualizar funciones de Evidencias

**Busca `btnAceptar.addEventListener`** y actualiza la lógica:

```javascript
btnAceptar.addEventListener('click', async () => {
  const nombre = nombreEvidencia.value.trim();
  const tipoVal = tipo.value;
  
  if (!tipoVal) {
    alert('Seleccione tipo de evidencia.');
    return;
  }
  if (!nombre) {
    alert('Ingrese nombre de la evidencia.');
    return;
  }
  if (!currentFile && !editingId) {
    alert('Cargue un archivo antes de aceptar.');
    return;
  }

  try {
    if (editingId) {
      // Actualizar
      await EvidenciasAPI.update(editingId, {
        estudiante: listaEstudiantes.value || null,
        tipo: tipoVal,
        nombre: nombre,
        descripcion: descripcion.value.trim(),
        archivo: currentFile,
      });
      showMessage('Evidencia modificada.');
    } else {
      // Crear
      await EvidenciasAPI.create({
        estudiante: listaEstudiantes.value || null,
        tipo: tipoVal,
        nombre: nombre,
        descripcion: descripcion.value.trim(),
        archivo: currentFile,
      });
      showMessage('Evidencia agregada.');
    }

    await renderTable();
    clearForm();
  } catch (error) {
    showMessage('Error: ' + error.message);
  }
});
```

---

### Paso 4: Actualizar renderizado de tablas

**Para tabla de libros - `renderTableLib()`:**

```javascript
async function renderTableLib() {
  try {
    libros = await LibrosAPI.getAll();
    tableBodyLib.innerHTML = '';
    
    if (libros.length === 0) {
      const r = document.createElement('tr');
      const c = document.createElement('td');
      c.colSpan = 6;
      c.textContent = 'No hay libros registrados aún.';
      r.appendChild(c);
      tableBodyLib.appendChild(r);
      return;
    }

    libros.forEach(book => {
      const row = document.createElement('tr');
      row.dataset.bookId = book._id;  // CAMBIO: Usar _id de MongoDB
      row.innerHTML = `
        <td>${book.idLibro}</td>
        <td>${book.nombre}</td>
        <td>${book.editorial || '-'}</td>
        <td>${book.autor || '-'}</td>
        <td>${book.numCopias}</td>
        <td>${Utils.formatDate(book.fechaIngreso)}</td>
      `;
      row.addEventListener('click', () => selectBookRowLib(row, book._id));
      tableBodyLib.appendChild(row);
    });
  } catch (error) {
    showMessageLib('Error al cargar: ' + error.message);
  }
}
```

**IMPORTANTE:** Ahora usamos `book._id` (ID de MongoDB) en lugar de `book.id`

---

### Paso 5: Actualizar selección de filas

**Busca `selectBookRowLib()` y actualiza:**

```javascript
function selectBookRowLib(row, id) {
  clearSelectionLib();
  row.classList.add('selected');
  selectedBookId = id;  // Ahora es el _id de MongoDB
  showMessageLib('Libro seleccionado. Presiona Editar para modificarlo.');
}
```

**Lo mismo para evidencias en `selectRow()`:**

```javascript
function selectRow(row, id) {
  clearSelection();
  row.classList.add('selected');
  selectedId = id;  // Ahora es el _id de MongoDB
  showMessage('Evidencia seleccionada');
}
```

---

## ⚠️ Cambios en Estructura de Datos

### Libro (MongoDB)
```javascript
// ANTES (localStorage)
{
  id: 1,
  idLibro: "LIB001",
  nombre: "...",
  // ...
}

// DESPUÉS (MongoDB)
{
  _id: "507f1f77bcf86cd799439011",  // ← ID de MongoDB
  idLibro: "LIB001",
  nombre: "...",
  // ...
}
```

### Evidencia (MongoDB)
```javascript
// ANTES (localStorage)
{
  id: 1,
  estudiante: "Juan",
  tipo: "Informe",
  // ...
}

// DESPUÉS (MongoDB)
{
  _id: "507f1f77bcf86cd799439012",  // ← ID de MongoDB
  estudiante: "Juan",
  tipo: "Informe",
  estado: "Pendiente",  // ← Nuevo campo
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
  // ...
}
```

---

## 🧪 Verificar que Funciona

1. **Abre la consola del navegador** (F12 → Console)

2. **Carga la página** - Verifica que aparezca mensaje de conectado

3. **Intenta crear un libro:**
   - Click "Nuevo"
   - Completa datos
   - Click "Guardar"
   - Verifica que aparezca en tabla

4. **Abre MongoDB Atlas:**
   - Database → Collections
   - Verifica que aparezca en `minibib.Libro`

5. **Si hay error:**
   - Revisa Console (F12)
   - Verifica que servidor esté corriendo (`npm start`)
   - Verifica .env con MongoDB URI

---

## 🔄 Resumen de Cambios Necesarios

| Elemento | Antes | Después |
|----------|-------|---------|
| **Almacenamiento** | localStorage | MongoDB API |
| **ID de registro** | Autoincrementado | MongoDB _id |
| **Validación** | Cliente + localStorage | Cliente + servidor |
| **Persistencia** | Solo en navegador | Servidor + BD |
| **Errores** | alert() | Utils.showError() |
| **Operaciones** | Síncronas | Asíncronas (async/await) |

---

## ✅ Checklist de Migración

- [ ] Agregar `<script src="api-client.js"></script>` en index.html
- [ ] Cambiar inicialización de app con `initApp()`
- [ ] Actualizar `renderTableLib()` para usar `LibrosAPI.getAll()`
- [ ] Actualizar `guardarLibroLib()` para usar `LibrosAPI.create/update`
- [ ] Actualizar `eliminarLibroLib()` para usar `LibrosAPI.delete`
- [ ] Cambiar referencias de IDs a `_id` de MongoDB
- [ ] Actualizar módulo Evidencias (mismo patrón)
- [ ] Probar CRUD de Libros
- [ ] Probar CRUD de Evidencias
- [ ] Verificar datos en MongoDB Atlas

---

## 📞 Si Necesitas Ayuda

- Verifica que servidor esté corriendo: `npm start`
- Abre Console (F12) para ver errores
- Verifica Network tab para ver requests a API
- Revisa [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para detalles de endpoints

**¡Ahora tu aplicación tiene persistencia real!** 🎉
