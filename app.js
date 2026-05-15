
let libros = [];
let estudiantes = [];

function registrarLibro(){

   let titulo = document.getElementById("tituloLibro").value;

   let libro = {
       titulo: titulo,
       disponible: true
   };

   libros.push(libro);

   alert("Libro registrado");
}

function registrarEstudiante(){

   let nombre = document.getElementById("nombreEstudiante").value;

   let identificacion = document.getElementById("idEstudiante").value;

   let estudiante = {
       nombre: nombre,
       identificacion: identificacion
   };

   estudiantes.push(estudiante);

   alert("Estudiante registrado");
}

function realizarPrestamo(){
    let titulo = document.getElementById("prestamoLibro").value;
    let id = document.getElementById("prestamoID").value;
 
    // 1. NUEVA VALIDACIÓN: Buscar si el estudiante existe
    let estudiante = estudiantes.find(e => e.identificacion === id);
 
    if(!estudiante){
        alert("Error: El estudiante no está registrado en el sistema.");
        return; // Detiene la ejecución si no lo encuentra
    }
 
    // 2. Buscar libro (Lógica existente)
    let libro = libros.find(l => l.titulo === titulo);
 
    if(id === ""){
        alert("Debe ingresar identificación");
        return;
    }
 
    if(!libro){
        alert("Libro no encontrado");
        return;
    }
 
    if(libro.disponible === false){
        alert("Libro no disponible");
        return;
    }
 
    // 3. Registrar prestamo (Lógica existente)
    libro.disponible = false;
    libro.fechaPrestamo = new Date();
    
    // Opcional: Puedes personalizar el mensaje con el nombre del estudiante
    alert("Préstamo realizado a " + estudiante.nombre + ". Máximo 3 días.");
 }


function mostrarLibros(){

   let lista = document.getElementById("listaLibros");

   lista.innerHTML = "";

   libros.forEach(libro => {

       let item = document.createElement("li");

       item.textContent =
       libro.titulo + " - " +
       (libro.disponible ? "Disponible" : "Prestado");

       lista.appendChild(item);
   });
}
