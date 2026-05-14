/**
 * revelado.js - Controla la aparición suave de las secciones al hacer scroll.
 */
document.addEventListener('DOMContentLoaded', () => {
    const opciones = {
        threshold: 0.15 // Se activa cuando el 15% de la sección es visible
    };

    const observador = new IntersectionObserver((entradas, observador) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                // Una vez revelada, dejamos de observarla para ahorrar recursos
                observador.unobserve(entrada.target);
            }
        });
    }, opciones);

    // Seleccionamos todos los contenedores de secciones en el HTML
    const secciones = document.querySelectorAll('main > div');
    
    secciones.forEach(seccion => {
        seccion.classList.add('revelar'); // Aplicamos el estado oculto inicial
        observador.observe(seccion);
    });
});