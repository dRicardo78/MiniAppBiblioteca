// Evidences management (cliente)
let evidencias = JSON.parse(localStorage.getItem('evidencias') || '[]');
let nextId = (evidencias.reduce((m, e) => Math.max(m, e.id), 0) || 0) + 1;
let selectedId = null;
let editingId = null;
let currentFile = null;

// DOM
const listaEstudiantes = document.getElementById('listaEstudiantes');
const tipo = document.getElementById('tipo');
const fecha = document.getElementById('fecha');
const nombreEvidencia = document.getElementById('nombreEvidencia');
const descripcion = document.getElementById('descripcion');
const archivoInput = document.getElementById('archivo');
const archivoNombre = document.getElementById('archivoNombre');
const tableBody = document.querySelector('#evidenceTable tbody');

const btnCargar = document.getElementById('btnCargar');
const btnNueva = document.getElementById('btnNueva');
const btnModificar = document.getElementById('btnModificar');
const btnEliminar = document.getElementById('btnEliminar');
const btnCancelar = document.getElementById('btnCancelar');
const btnAceptar = document.getElementById('btnAceptar');
const btnSalir = document.getElementById('btnSalir');

const modalSalir = document.getElementById('modalSalir');
const salirYes = document.getElementById('salirYes');
const salirNo = document.getElementById('salirNo');
const modalEliminar = document.getElementById('modalEliminar');
const elimYes = document.getElementById('elimYes');
const elimNo = document.getElementById('elimNo');

function saveState() {
  localStorage.setItem('evidencias', JSON.stringify(evidencias));
}

function showMessage(text, timeout = 2500) {
  let box = document.getElementById('messageBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'messageBox';
    box.className = 'message';
    const panel = document.querySelector('.evidence-panel');
    panel.insertBefore(box, panel.firstChild);
  }
  box.textContent = text;
  if (timeout > 0) setTimeout(() => { if (box) box.textContent = ''; }, timeout);
}

function setDateNow() {
  const d = new Date();
  fecha.value = d.toLocaleDateString();
}

function clearForm() {
  listaEstudiantes.value = '';
  tipo.value = '';
  nombreEvidencia.value = '';
  descripcion.value = '';
  archivoInput.value = '';
  archivoNombre.textContent = 'Ningún archivo cargado';
  currentFile = null;
  editingId = null;
  selectedId = null;
  clearSelection();
  setDateNow();
}

function clearSelection() {
  const sel = tableBody.querySelector('tr.selected');
  if (sel) sel.classList.remove('selected');
}

function renderTable() {
  tableBody.innerHTML = '';
  if (!evidencias.length) {
    const r = document.createElement('tr');
    const c = document.createElement('td');
    c.colSpan = 6;
    c.textContent = 'No hay evidencias registradas.';
    r.appendChild(c);
    tableBody.appendChild(r);
    return;
  }

  evidencias.forEach(ev => {
    const r = document.createElement('tr');
    r.dataset.id = ev.id;
    r.innerHTML = `
      <td>${ev.id}</td>
      <td>${escapeHtml(ev.nombre)}</td>
      <td>${escapeHtml(ev.tipo)}</td>
      <td>${ev.fecha}</td>
      <td>${escapeHtml(ev.descripcion || '')}</td>
      <td>${ev.archivo && ev.archivo.name ? `<a href="${ev.archivo.url}" target="_blank">${escapeHtml(ev.archivo.name)}</a>` : '-'}</td>
    `;
    r.addEventListener('click', () => selectRow(r, ev.id));
    tableBody.appendChild(r);
  });
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (m)=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

function selectRow(row, id) {
  clearSelection();
  row.classList.add('selected');
  selectedId = id;
  showMessage('Evidencia seleccionada');
}

btnCargar.addEventListener('click', () => archivoInput.click());
archivoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  if (!allowed.includes(file.type)) {
    alert('Tipo de archivo no permitido. Use PDF, Word o Excel.');
    archivoInput.value = '';
    return;
  }
  currentFile = { name: file.name, size: file.size, mime: file.type, url: URL.createObjectURL(file) };
  archivoNombre.textContent = file.name;
});

btnNueva.addEventListener('click', () => {
  clearForm();
  showMessage('Formulario limpio. Fecha actualizada.');
});

btnAceptar.addEventListener('click', () => {
  const nombre = nombreEvidencia.value.trim();
  const tipoVal = tipo.value;
  if (!tipoVal) { alert('Seleccione tipo de evidencia.'); return; }
  if (!nombre) { alert('Ingrese nombre de la evidencia.'); return; }
  if (!currentFile && !editingId) { alert('Cargue un archivo antes de aceptar.'); return; }

  if (editingId) {
    // actualizar
    const idx = evidencias.findIndex(e => e.id === editingId);
    if (idx === -1) { alert('No se encontró la evidencia a modificar.'); return; }
    evidencias[idx].tipo = tipoVal;
    evidencias[idx].nombre = nombre;
    evidencias[idx].descripcion = descripcion.value.trim();
    if (currentFile) evidencias[idx].archivo = currentFile;
    saveState();
    renderTable();
    clearForm();
    showMessage('Evidencia modificada.');
    return;
  }

  const nueva = {
    id: nextId++,
    estudiante: listaEstudiantes.value || null,
    tipo: tipoVal,
    nombre: nombre,
    descripcion: descripcion.value.trim(),
    fecha: new Date().toLocaleDateString(),
    archivo: currentFile
  };
  evidencias.push(nueva);
  saveState();
  renderTable();
  clearForm();
  showMessage('Evidencia agregada.');
});

btnModificar.addEventListener('click', () => {
  if (!selectedId) { alert('Seleccione una evidencia en la grilla.'); return; }
  const ev = evidencias.find(e => e.id === selectedId);
  if (!ev) { alert('Evidencia no encontrada.'); return; }
  // cargar en formulario
  tipo.value = ev.tipo;
  nombreEvidencia.value = ev.nombre;
  descripcion.value = ev.descripcion || '';
  if (ev.archivo) {
    archivoNombre.textContent = ev.archivo.name;
    currentFile = ev.archivo;
  } else {
    archivoNombre.textContent = 'Ningún archivo cargado';
    currentFile = null;
  }
  editingId = ev.id;
  showMessage('Modo edición: modifique y presione Aceptar.');
});

btnEliminar.addEventListener('click', () => {
  if (!selectedId) { alert('Seleccione una evidencia en la grilla.'); return; }
  modalEliminar.classList.add('active');
  modalEliminar.setAttribute('aria-hidden','false');
});

elimYes.addEventListener('click', () => {
  const idx = evidencias.findIndex(e => e.id === selectedId);
  if (idx !== -1) {
    evidencias.splice(idx,1);
    saveState();
    renderTable();
    clearForm();
    showMessage('Evidencia eliminada.');
  }
  modalEliminar.classList.remove('active');
  modalEliminar.setAttribute('aria-hidden','true');
});
elimNo.addEventListener('click', () => {
  modalEliminar.classList.remove('active');
  modalEliminar.setAttribute('aria-hidden','true');
});

btnCancelar.addEventListener('click', () => { clearForm(); showMessage('Operación cancelada.'); });

btnSalir.addEventListener('click', () => {
  modalSalir.classList.add('active');
  modalSalir.setAttribute('aria-hidden','false');
});

salirYes.addEventListener('click', () => { window.location.href = 'about:blank'; });
salirNo.addEventListener('click', () => { modalSalir.classList.remove('active'); modalSalir.setAttribute('aria-hidden','true'); });

// menu toggles
document.querySelectorAll('.menu-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    const open = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.submenu').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.menu-toggle').forEach(b => b.setAttribute('aria-expanded','false'));
    if (!open) { target.style.display = 'block'; btn.setAttribute('aria-expanded','true'); }
  });
});

// Module selector
const moduleSelector = document.getElementById('moduleSelector');
const openLibrary = document.getElementById('openLibrary');
const openEvidences = document.getElementById('openEvidences');
const libraryPanel = document.getElementById('libraryPanel');
const evidencePanel = document.getElementById('evidencePanel');

const sidebar = document.getElementById('sidebar');
const btnBack = document.getElementById('btnBack');

function showModule(name) {
  moduleSelector.style.display = 'none';
  btnBack.style.display = '';
  if (name === 'library') {
    libraryPanel.style.display = '';
    evidencePanel.style.display = 'none';
    sidebar.style.display = 'none';
    document.querySelector('.layout').classList.add('full-width');
  } else if (name === 'evidences') {
    evidencePanel.style.display = '';
    libraryPanel.style.display = 'none';
    sidebar.style.display = '';
    document.querySelector('.layout').classList.remove('full-width');
  }
}

function showSelector() {
  moduleSelector.style.display = 'flex';
  libraryPanel.style.display = 'none';
  evidencePanel.style.display = 'none';
  sidebar.style.display = 'none';
  btnBack.style.display = 'none';
  document.querySelector('.layout').classList.add('full-width');
}

openLibrary.addEventListener('click', () => showModule('library'));
openEvidences.addEventListener('click', () => showModule('evidences'));
btnBack.addEventListener('click', () => showSelector());

// Biblioteca module (restored)
(() => {
  const librosKey = 'libros';
  let libros = JSON.parse(localStorage.getItem(librosKey) || '[]');
  let selectedBookId = null;
  let isEditing = false;

  const form = document.getElementById('bookFormLib');
  const fechaIngreso = document.getElementById('fechaIngresoLib');
  const idLibro = document.getElementById('idLibroLib');
  const nombreLibro = document.getElementById('nombreLibroLib');
  const editorial = document.getElementById('editorialLib');
  const autor = document.getElementById('autorLib');
  const numCopias = document.getElementById('numCopiasLib');
  const messageBox = document.getElementById('messageBoxLib');
  const tableBodyLib = document.querySelector('#booksTableLib tbody');

  const btnNuevo = document.getElementById('btnNuevoLib');
  const btnEditar = document.getElementById('btnEditarLib');
  const btnGuardar = document.getElementById('btnGuardarLib');
  const btnEliminar = document.getElementById('btnEliminarLib');
  const btnLimpiar = document.getElementById('btnLimpiarLib');
  const btnCancelarLib = document.getElementById('btnCancelarLib');
  const btnMostrarLib = document.getElementById('btnMostrarLib');
  const btnSalirLib = document.getElementById('btnSalirLib');

  function saveLibState() { localStorage.setItem(librosKey, JSON.stringify(libros)); }

  function setDefaultDateLib() { fechaIngreso.value = new Date().toISOString().split('T')[0]; }

  function showMessageLib(text, type = 'info') {
    if (!messageBox) return;
    messageBox.textContent = text;
  }

  function resetFormLib() {
    form.reset();
    setDefaultDateLib();
    selectedBookId = null;
    isEditing = false;
    idLibro.readOnly = false;
    clearSelectionLib();
    showMessageLib('Formulario listo para nuevo registro.');
  }

  function clearSelectionLib() {
    const sel = tableBodyLib.querySelector('tr.selected');
    if (sel) sel.classList.remove('selected');
  }

  function getFormDataLib() {
    return {
      fechaIngreso: fechaIngreso.value,
      id: idLibro.value.trim(),
      nombre: nombreLibro.value.trim(),
      editorial: editorial.value.trim(),
      autor: autor.value.trim(),
      copias: Number(numCopias.value)
    };
  }

  function validateBookLib(book) {
    if (!book.id) return 'El ID Libro es obligatorio.';
    if (book.id.length > 10) return 'ID Libro debe tener máximo 10 caracteres.';
    if (!book.nombre) return 'Nombre del libro es obligatorio.';
    if (book.nombre.length > 100) return 'Nombre del libro debe tener máximo 100 caracteres.';
    if (book.editorial.length > 100) return 'Editorial debe tener máximo 100 caracteres.';
    if (book.autor.length > 100) return 'Autor debe tener máximo 100 caracteres.';
    if (!book.copias || book.copias < 1 || book.copias > 999) return 'Número de copias debe ser entre 1 y 999.';
    return '';
  }

  function renderTableLib() {
    tableBodyLib.innerHTML = '';
    if (libros.length === 0) {
      const r = document.createElement('tr');
      const c = document.createElement('td'); c.colSpan = 6; c.textContent = 'No hay libros registrados aún.'; r.appendChild(c); tableBodyLib.appendChild(r); return;
    }
    libros.forEach(book => {
      const row = document.createElement('tr');
      row.dataset.bookId = book.id;
      row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.nombre}</td>
        <td>${book.editorial || '-'}</td>
        <td>${book.autor || '-'}</td>
        <td>${book.copias}</td>
        <td>${book.fechaIngreso}</td>
      `;
      row.addEventListener('click', () => selectBookRowLib(row, book.id));
      tableBodyLib.appendChild(row);
    });
  }

  function selectBookRowLib(row, id) {
    clearSelectionLib();
    row.classList.add('selected');
    selectedBookId = id;
    showMessageLib('Libro seleccionado. Presiona Editar para modificarlo.');
  }

  function loadBookToFormLib(book) {
    fechaIngreso.value = book.fechaIngreso;
    idLibro.value = book.id;
    nombreLibro.value = book.nombre;
    editorial.value = book.editorial;
    autor.value = book.autor;
    numCopias.value = book.copias;
    isEditing = false;
    idLibro.readOnly = true;
  }

  function guardarLibroLib() {
    const book = getFormDataLib();
    const error = validateBookLib(book);
    if (error) { showMessageLib(error); return; }
    if (selectedBookId && isEditing) {
      // update
      const idx = libros.findIndex(item => item.id === selectedBookId);
      if (idx === -1) { showMessageLib('No se encontró el libro seleccionado.'); return; }
      libros[idx] = book; saveLibState(); renderTableLib(); resetFormLib(); showMessageLib('Cambios guardados.'); return;
    }
    const existing = libros.findIndex(item => item.id === book.id);
    if (existing !== -1) { showMessageLib('Ya existe un libro con ese ID.'); return; }
    libros.push(book); saveLibState(); renderTableLib(); resetFormLib(); showMessageLib('Libro guardado correctamente.');
  }

  function editarLibroLib() {
    if (!selectedBookId) { showMessageLib('Selecciona un libro en la grilla para editarlo.'); return; }
    const book = libros.find(item => item.id === selectedBookId);
    if (!book) { showMessageLib('No se encontró el libro seleccionado.'); return; }
    loadBookToFormLib(book); isEditing = true; showMessageLib('Modo edición activado.');
  }

  function eliminarLibroLib() {
    if (!selectedBookId) { showMessageLib('Selecciona un libro en la grilla para eliminarlo.'); return; }
    const confirmDelete = confirm('¿Eliminar el libro seleccionado?');
    if (!confirmDelete) { showMessageLib('Eliminación cancelada.'); return; }
    const idx = libros.findIndex(item => item.id === selectedBookId);
    if (idx === -1) { showMessageLib('No se encontró el libro a eliminar.'); return; }
    libros.splice(idx,1); saveLibState(); resetFormLib(); renderTableLib(); showMessageLib('Libro eliminado correctamente.');
  }

  btnGuardar.addEventListener('click', guardarLibroLib);
  btnNuevo.addEventListener('click', resetFormLib);
  btnEditar.addEventListener('click', editarLibroLib);
  btnEliminar.addEventListener('click', eliminarLibroLib);
  btnLimpiar.addEventListener('click', () => { form.reset(); setDefaultDateLib(); });
  btnCancelarLib.addEventListener('click', () => { resetFormLib(); showMessageLib('Operación cancelada.'); });
  btnMostrarLib.addEventListener('click', renderTableLib);
  btnSalirLib.addEventListener('click', () => { showSelector(); });

  form.addEventListener('reset', () => { setTimeout(() => { setDefaultDateLib(); selectedBookId = null; isEditing = false; idLibro.readOnly = false; clearSelectionLib(); },0); });

  setDefaultDateLib(); renderTableLib();
})();

// inicializar (evidences)
showSelector();
setDateNow();
renderTable();
