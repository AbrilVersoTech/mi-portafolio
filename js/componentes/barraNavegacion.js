/**
 * Genera e inyecta la barra de navegación con trazabilidad en consola y efecto de descarga en el CV.
 * @param {string} idContenedor - ID del elemento donde se renderizará el menú.
 */
const renderizarNavegacion = (idContenedor) => {
    console.log("--- [DEBUG] Iniciando renderizarNavegacion ---");
    const contenedor = document.getElementById(idContenedor);
    
    if (!contenedor) {
        console.error(`--- [ERROR] No se encontró el contenedor con ID: ${idContenedor} ---`);
        return;
    }

    console.log("--- [DEBUG] Contenedor encontrado. Preparando inyección de HTML... ---");

    const estructuraMenu = `
        <header class="encabezado-principal">
            <nav class="barra-nav">
                <div class="logo-contenedor">
                    <a href="../../index.html" class="enlace-logo">
                        <svg viewBox="0 0 100 100" class="logo-mini">
                            <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  stroke-width="5"/>
                            <image href="../../imagenes/logo.svg" x="25" y="25" width="50" height="50" class="logo-mini-img" />
                        </svg>
                    </a>
                </div>

                <div class="enlaces-contenedor" id="menu-movil">
                    <ol class="lista-nav">
                        <li><a href="#sobre-mi" class="enlace-nav"><span>01.</span> Sobre mí</a></li>
                        <li><a href="#experiencia" class="enlace-nav"><span>02.</span> Experiencia</a></li>
                        <li><a href="#proyectos" class="enlace-nav"><span>03.</span> Proyectos</a></li>
                        <li><a href="#contacto" class="enlace-nav"><span>04.</span> Contacto</a></li>
                    </ol>
                </div>

                <div class="controles-navegacion">
                    <a href="../../assets/pdf/Hoja_de_Vida-Diego Abril.pdf" 
                       class="boton-cv" 
                       id="btn-cv" 
                       download="CV_Diego_Abril_2026.pdf">
                        <span class="texto-cv">Currículum</span>
                        <div class="icono-descarga">
                            <img src="../../imagenes/icono_boton_descarca/1.svg" class="svg-f frame-1" alt="">
                            <img src="../../imagenes/icono_boton_descarca/2.svg" class="svg-f frame-2" alt="">
                            <img src="../../imagenes/icono_boton_descarca/3.svg" class="svg-f frame-3" alt="">
                            <img src="../../imagenes/icono_boton_descarca/4.svg" class="svg-f frame-4" alt="">
                            <img src="../../imagenes/icono_boton_descarca/5.svg" class="svg-f frame-5" alt="">
                            <img src="../../imagenes/icono_boton_descarca/6.svg" class="svg-f frame-6" alt="">
                        </div>
                    </a>
                    <button class="menu-hamburguesa" id="btn-menu" aria-label="Abrir menú">
                        <span class="linea"></span><span class="linea"></span><span class="linea"></span>
                    </button>
                </div>
            </nav>
        </header>
    `;

    contenedor.innerHTML = estructuraMenu;
    console.log("--- [DEBUG] HTML inyectado en el DOM. ---");

    // --- Sincronización de Animación de Entrada ---
    const header = contenedor.querySelector('.encabezado-principal');
    if (header) {
        console.log("--- [DEBUG] Header detectado. Solicitando frames de animación... ---");
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                header.classList.add('cargado');
                console.log("--- [SUCCESS] Clase 'cargado' añadida. La cascada debería ser visible ahora. ---");
            });
        });
    } else {
        console.error("--- [ERROR] No se pudo encontrar el elemento '.encabezado-principal' tras la inyección. ---");
    }

    // --- Lógica de Descarga Interactiva (CV) ---
    const btnCv = document.getElementById('btn-cv');
    if (btnCv) {
        btnCv.addEventListener('click', function() {
            // Evitamos múltiples clics durante la animación
            if (btnCv.classList.contains('ejecutando-descarga')) return;

            console.log("--- [EVENT] Inicio de secuencia de descarga animada (Frames 1-6). ---");
            btnCv.classList.add('ejecutando-descarga');

            // La animación visual (frames 2-5) se gestiona por CSS.
            // Esperamos 5 segundos totales para que el usuario vea el estado final (6.svg)
            // antes de resetear el botón al estado inicial (flecha).
            setTimeout(() => {
                btnCv.classList.remove('ejecutando-descarga');
                console.log("--- [DEBUG] Secuencia completa. Reseteando a frame 1. ---");
            }, 5000);
        });
    }

    // --- Lógica de Interacción para el Menú Móvil ---
    const btnMenu = document.getElementById('btn-menu');
    const menuMovil = document.getElementById('menu-movil');

    if (btnMenu && menuMovil) {
        btnMenu.addEventListener('click', () => {
            console.log("--- [EVENT] Click en menú hamburguesa. ---");
            btnMenu.classList.toggle('activo');
            menuMovil.classList.toggle('abierto');
            document.body.classList.toggle('menu-abierto-scroll');
        });
    } else {
        console.warn("--- [WARN] Botón de menú o contenedor móvil no encontrados para asignar eventos. ---");
    }
};

// Autoejecución al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log("--- [SYSTEM] DOM cargado. Ejecutando renderizado de navegación... ---");
    renderizarNavegacion('encabezado-sitio');
});