const libros = [];
let selectedBookId = null;
let isEditing = false;

const form = document.getElementById("bookForm");
const fechaIngreso = document.getElementById("fechaIngreso");
const idLibro = document.getElementById("idLibro");
const nombreLibro = document.getElementById("nombreLibro");
const editorial = document.getElementById("editorial");
const autor = document.getElementById("autor");
const numCopias = document.getElementById("numCopias");
const messageBox = document.getElementById("messageBox");
const tableBody = document.querySelector("#booksTable tbody");

const btnNuevo = document.getElementById("btnNuevo");
const btnEditar = document.getElementById("btnEditar");
const btnGuardar = document.getElementById("btnGuardar");
const btnEliminar = document.getElementById("btnEliminar");
const btnCancelar = document.getElementById("btnCancelar");
const btnMostrar = document.getElementById("btnMostrar");
const btnSalir = document.getElementById("btnSalir");
const modal = document.getElementById("confirmModal");
const modalYes = document.getElementById("modalYes");
const modalNo = document.getElementById("modalNo");

function setDefaultDate() {
  fechaIngreso.value = new Date().toISOString().split("T")[0];
}

function showMessage(text, type = "info") {
  messageBox.textContent = text;
  messageBox.style.background = type === "success" ? "#ecfdf5" : type === "error" ? "#fde2e2" : type === "warning" ? "#fffbeb" : "#eff6ff";
  messageBox.style.color = type === "success" ? "#166534" : type === "error" ? "#b91c1c" : type === "warning" ? "#92400e" : "#1e3a8a";
  messageBox.style.borderColor = type === "success" ? "#a7f3d0" : type === "error" ? "#fecaca" : type === "warning" ? "#fde68a" : "#bfdbfe";
}

function resetForm() {
  form.reset();
  setDefaultDate();
  selectedBookId = null;
  isEditing = false;
  setFormReadonly(false);
  idLibro.readOnly = false;
  btnGuardar.textContent = "Guardar";
  clearSelection();
  showMessage("Formulario listo para nuevo registro.", "info");
}

function clearSelection() {
  const selectedRow = tableBody.querySelector("tr.selected");
  if (selectedRow) {
    selectedRow.classList.remove("selected");
  }
}

function setFormReadonly(readonly) {
  idLibro.readOnly = readonly;
  nombreLibro.readOnly = readonly;
  editorial.readOnly = readonly;
  autor.readOnly = readonly;
  numCopias.readOnly = readonly;
}

function setFormEditing(editable) {
  idLibro.readOnly = true;
  nombreLibro.readOnly = !editable;
  editorial.readOnly = !editable;
  autor.readOnly = !editable;
  numCopias.readOnly = !editable;
}

function getFormData() {
  return {
    fechaIngreso: fechaIngreso.value,
    id: idLibro.value.trim(),
    nombre: nombreLibro.value.trim(),
    editorial: editorial.value.trim(),
    autor: autor.value.trim(),
    copias: Number(numCopias.value)
  };
}

function validateBook(book) {
  if (!book.id) return "El ID Libro es obligatorio.";
  if (book.id.length > 10) return "ID Libro debe tener máximo 10 caracteres.";
  if (!book.nombre) return "Nombre del libro es obligatorio.";
  if (book.nombre.length > 100) return "Nombre del libro debe tener máximo 100 caracteres.";
  if (book.editorial.length > 100) return "Editorial debe tener máximo 100 caracteres.";
  if (book.autor.length > 100) return "Autor debe tener máximo 100 caracteres.";
  if (!book.copias || book.copias < 1 || book.copias > 999) return "Número de copias debe ser entre 1 y 999.";
  return "";
}

function renderTable() {
  tableBody.innerHTML = "";

  if (libros.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 6;
    emptyCell.textContent = "No hay libros registrados aún.";
    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
    return;
  }

  libros.forEach(book => {
    const row = document.createElement("tr");
    row.dataset.bookId = book.id;
    row.innerHTML = `
      <td>${book.id}</td>
      <td>${book.nombre}</td>
      <td>${book.editorial || "-"}</td>
      <td>${book.autor || "-"}</td>
      <td>${book.copias}</td>
      <td>${book.fechaIngreso}</td>
    `;
    row.addEventListener("click", () => selectBookRow(row, book.id));
    tableBody.appendChild(row);
  });
}

function selectBookRow(row, id) {
  clearSelection();
  row.classList.add("selected");
  selectedBookId = id;
  showMessage("Libro seleccionado. Presiona Editar para modificarlo.", "info");
}

function loadBookToForm(book) {
  fechaIngreso.value = book.fechaIngreso;
  idLibro.value = book.id;
  nombreLibro.value = book.nombre;
  editorial.value = book.editorial;
  autor.value = book.autor;
  numCopias.value = book.copias;
  isEditing = false;
  setFormReadonly(true);
  btnGuardar.textContent = "Guardar";
}

function guardarLibro() {
  const book = getFormData();
  const error = validateBook(book);
  if (error) {
    showMessage(error, "error");
    return;
  }

  if (selectedBookId && isEditing) {
    openModal();
    return;
  }

  if (selectedBookId && !isEditing) {
    showMessage("Selecciona Editar para modificar el libro antes de guardar.", "warning");
    return;
  }

  const existingIndex = libros.findIndex(item => item.id === book.id);
  if (existingIndex !== -1) {
    showMessage("Ya existe un libro con ese ID.", "error");
    return;
  }

  libros.push(book);
  showMessage("Libro guardado correctamente.", "success");
  resetForm();
  renderTable();
}

function editarLibro() {
  if (!selectedBookId) {
    showMessage("Selecciona un libro en la grilla para editarlo.", "warning");
    return;
  }

  const book = libros.find(item => item.id === selectedBookId);
  if (!book) {
    showMessage("No se encontró el libro seleccionado.", "error");
    return;
  }

  loadBookToForm(book);
  isEditing = true;
  setFormEditing(true);
  showMessage("Modo edición activado. Modifica los campos y luego guarda.", "info");
}

function openModal() {
  if (!modal) return;
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
}

function confirmEdit() {
  const book = getFormData();
  const error = validateBook(book);
  if (error) {
    showMessage(error, "error");
    closeModal();
    return;
  }

  const index = libros.findIndex(item => item.id === selectedBookId);
  if (index === -1) {
    showMessage("No se encontró el libro seleccionado.", "error");
    closeModal();
    return;
  }

  libros[index] = book;
  renderTable();
  closeModal();
  isEditing = false;
  loadBookToForm(book);
  showMessage("Cambios guardados correctamente.", "success");
}

function cancelEdit() {
  if (selectedBookId) {
    const book = libros.find(item => item.id === selectedBookId);
    if (book) {
      loadBookToForm(book);
    }
  }
  isEditing = false;
  closeModal();
  showMessage("Cambios descartados.", "info");
}

function eliminarLibro() {
  if (!selectedBookId) {
    showMessage("Selecciona un libro en la grilla para eliminarlo.", "warning");
    return;
  }

  const confirmDelete = confirm("¿Eliminar el libro seleccionado?");
  if (!confirmDelete) {
    showMessage("Eliminación cancelada.", "info");
    return;
  }

  const index = libros.findIndex(item => item.id === selectedBookId);
  if (index === -1) {
    showMessage("No se encontró el libro a eliminar.", "error");
    return;
  }

  libros.splice(index, 1);
  resetForm();
  renderTable();
  showMessage("Libro eliminado correctamente.", "success");
}

function cancelarOperacion() {
  resetForm();
  showMessage("Operación cancelada.", "info");
}

function mostrarDatos() {
  renderTable();
  showMessage("Datos actualizados en la grilla.", "info");
}

function salirAplicacion() {
  showMessage("Salir no es compatible en esta vista web.", "warning");
}

btnGuardar.addEventListener("click", guardarLibro);
btnNuevo.addEventListener("click", resetForm);
btnEditar.addEventListener("click", editarLibro);
btnEliminar.addEventListener("click", eliminarLibro);
btnCancelar.addEventListener("click", cancelarOperacion);
btnMostrar.addEventListener("click", mostrarDatos);
btnSalir.addEventListener("click", salirAplicacion);
modalYes.addEventListener("click", confirmEdit);
modalNo.addEventListener("click", cancelEdit);

form.addEventListener("reset", () => {
  setTimeout(() => {
    setDefaultDate();
    selectedBookId = null;
    isEditing = false;
    setFormReadonly(false);
    idLibro.readOnly = false;
    clearSelection();
    btnGuardar.textContent = "Guardar";
  }, 0);
});

setDefaultDate();
renderTable();
