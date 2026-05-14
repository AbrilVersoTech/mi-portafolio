/**
 * Modulo de navegación y utilidades globales
 * Implementa saneamiento básico y manejo de eventos
 */

/**
 * Función de transición para mostrar la pantalla de carga y redirigir
 */
const iniciarTransicionPrincipal = () => {
    const pantallaCarga = document.getElementById('pantalla-carga');
    if (pantallaCarga) {
        pantallaCarga.classList.remove('oculto');
        setTimeout(() => {
            window.location.href = 'paginas/principal/contenedor.html';
        }, 2500);
    }
};

/**
 * Gestión centralizada de eventos para cumplir con CSP
 */
const gestionarEventosNavegacion = () => {
    const botonProyectos = document.getElementById('btn-proyectos');

    if (botonProyectos) {
        botonProyectos.addEventListener('click', (e) => {
            e.preventDefault();
            console.info("Redirigiendo a sección de proyectos...");
            iniciarTransicionPrincipal(); 
        });
    }
};

// Inicialización segura tras cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    gestionarEventosNavegacion();
});