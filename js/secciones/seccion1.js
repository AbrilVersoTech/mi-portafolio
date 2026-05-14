/**
 * Renderiza la Sección 01: Sobre mí.
 * - Estética Premium: Resplandores cian, bordes brillantes y fuentes unificadas.
 * - Interactividad: Foto circular interactiva que sigue el cursor del usuario.
 * - Consistencia: Idéntico en Web y Móvil (Soporte Touch incluido).
 * - NOTA: Los estilos se han movido a archivos CSS externos.
 */
const renderizarSobreMi = (idContenedor) => {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    const rutaBaseTech = "../../imagenes/tecnologias/";
    const rutaPerfil = "../../imagenes/perfil/";

    const contenido = `
        <section id="sobre-mi" class="seccion-sobre-mi">
            <div class="contenedor-sobre-mi">
                <h2 class="titulo-seccion">
                    <span class="numero-titulo">01.</span> Sobre mí
                </h2>
                
                <div class="cuerpo-sobre-mi" id="area-limite-bio">
                    
                    <!-- Espaciador dinámico que asegura la envoltura en CSS nativo -->
                    <div id="spacer-dinamico"></div>

                    <div class="marco-foto-circular" id="foto-interactiva">
                        <img src="${rutaPerfil}perfil_DiegoAbril.webp" alt="Diego Israel Abril Díaz" class="foto-perfil-img" draggable="false">
                    </div>

                    <div class="texto-biografia" id="bloque-texto">
                        <p>
                            Hola, soy <strong>Diego Israel Abril Díaz</strong>, profesional especializado en el desarrollo de software con un enfoque en soluciones seguras y escalables.
                        </p>
                        <p>
                            Como <strong>Ingeniero en Tecnologías de la Información</strong> graduado de la <strong>Universidad Técnica de Ambato (2025)</strong>, cuento con una sólida base técnica en ciberseguridad web. Mi investigación se ha centrado en el análisis de vulnerabilidades informáticas, lo que me permite construir infraestructuras tecnológicas robustas.
                        </p>
                        <p>
                            Me especializo en arquitecturas modernas y procesamiento asíncrono, integrando herramientas avanzadas para la optimización de procesos digitales.
                        </p>
                    </div>
                    
                    <div class="clearfix"></div>
                </div>

                <p class="subtitulo-tecnico">Tecnologías clave de mi perfil profesional:</p>
                
                <div class="cuadricula-tecnologias">
                    ${['typescript', 'react', 'nextjs', 'nodejs', 'docker', 'postgresql'].map(tech => `
                        <div class="item-tecnologia-premium" title="${tech}">
                            <div class="cubo-icono-glow">
                                <img src="${rutaBaseTech}${tech}.ico" alt="${tech}" class="img-tech">
                            </div>
                            <span class="label-tech">${tech.toUpperCase()}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;

    contenedor.innerHTML = contenido;

    const foto = document.getElementById('foto-interactiva');
    const spacer = document.getElementById('spacer-dinamico');
    const imgElement = foto.querySelector('.foto-perfil-img');

    // --- POSICIÓN FIJA A LA IZQUIERDA Y JUSTIFICACIÓN NATIVA ---
    const fijarPosicionIzquierda = () => {
        const fotoW = foto.offsetWidth;
        const fotoH = foto.offsetHeight;
        
        foto.style.left = '0px';
        foto.style.top = '0px';

        spacer.style.display = 'contents'; 
        spacer.innerHTML = "";
        
        const shape = document.createElement("div");
        shape.style.width = `${fotoW}px`;
        shape.style.height = `${fotoH}px`;
        shape.style.marginTop = `0px`;
        shape.style.shapeOutside = "circle(50%)";
        shape.style.clipPath = "circle(50%)";
        shape.style.shapeMargin = "18px";
        shape.style.background = "transparent";
        shape.style.float = "left";
        shape.style.marginLeft = "0px";

        spacer.appendChild(shape);
    };

    // --- LÓGICA DE SEGUIMIENTO (TRACKING) DE CURSOR / TOUCH ---
    const rastrearCursor = (clientX, clientY) => {
        const rect = foto.getBoundingClientRect();
        const cx = rect.left + (rect.width / 2);
        const cy = rect.top + (rect.height / 2);
        
        const dx = clientX - cx;
        const dy = clientY - cy;
        
        let nombreImagen = 'perfil_DiegoAbril.webp'; 
        const umbralCentro = 60; 

        const esDerecha = dx > umbralCentro;
        const esIzquierda = dx < -umbralCentro;
        const esArriba = dy < -umbralCentro;
        const esAbajo = dy > umbralCentro;

        if (esArriba && esDerecha) {
            nombreImagen = 'perfilarribaderecha_DiegoAbril.webp';
        } else if (esArriba && esIzquierda) {
            nombreImagen = 'perfilarribaizquierda_DiegoAbril.webp';
        } else if (esAbajo && esDerecha) {
            nombreImagen = 'perfilbajoderecha_DiegoAbril.webp';
        } else if (esAbajo && esIzquierda) {
            nombreImagen = 'perfilbajoizquierda_DiegoAbril.webp';
        } else if (esDerecha) {
            nombreImagen = 'perfilderecho_DiegoAbril.webp';
        } else if (esIzquierda) {
            nombreImagen = 'perfilizquierdo_DiegoAbril.webp';
        } else if (esArriba) {
            nombreImagen = 'perfilarriba_DiegoAbril.webp';
        } else if (esAbajo) {
            nombreImagen = 'perfilbajo_DiegoAbril.webp';
        }

        if (!imgElement.src.includes(nombreImagen)) {
            imgElement.src = `${rutaPerfil}${nombreImagen}`;
        }
    };

    window.addEventListener('mousemove', (e) => {
        rastrearCursor(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            rastrearCursor(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    window.addEventListener('resize', fijarPosicionIzquierda);

    setTimeout(() => {
        fijarPosicionIzquierda();
    }, 50);
};

document.addEventListener('DOMContentLoaded', () => {
    renderizarSobreMi('seccion-1-sobremi');
});