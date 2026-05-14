/**
 * Renderiza la Sección 02: Experiencia Profesional (Galería Vertical).
 * Basado en la Hoja de Vida de Diego Israel Abril Díaz.
 */
const renderizarExperiencia = (idContenedor) => {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    const trabajos = [
        {
            id: 'confianza-data',
            empresa: 'Confianza Data',
            cargo: 'Desarrollador y Analista de Datos',
            periodo: 'Julio 2025 — Octubre 2025 [cite: 18]',
            logros: [
                'Desarrollé módulos de análisis de datos para optimización de procesos de inteligencia de negocios[cite: 19].',
                'Implementé scripts automatizados para el manejo eficiente de flujos de información digital[cite: 20].'
            ]
        },
        {
            id: 'jorix',
            empresa: 'Empresa Jorix',
            cargo: 'Asistente de TI',
            periodo: 'Marzo 2023 — Abril 2023 [cite: 23]',
            logros: [
                'Ejecuté tareas de soporte técnico y mantenimiento preventivo de sistemas e infraestructura[cite: 25].',
                'Gestioné la seguridad de redes internas, mitigando riesgos de acceso no autorizado[cite: 26].'
            ]
        }
    ];

    const contenido = `
        <section id="experiencia" class="seccion-experiencia">
            <div class="contenedor-experiencia">
                <h2 class="titulo-seccion">
                    <span class="numero-titulo">02.</span>Experiencia
                </h2>

                <div class="galeria-experiencia">
                    <div class="lista-pestanas" role="tablist">
                        ${trabajos.map((job, i) => `
                            <button class="boton-tab ${i === 0 ? 'activo' : ''}" 
                                    data-id="${job.id}" role="tab" aria-selected="${i === 0}">
                                <span>${job.empresa}</span>
                            </button>
                        `).join('')}
                        <div class="indicador-movil"></div>
                    </div>

                    <div class="paneles-contenido">
                        ${trabajos.map((job, i) => `
                            <div class="panel-experiencia ${i === 0 ? 'visible' : ''}" id="panel-${job.id}" role="tabpanel">
                                <h3 class="cabecera-cargo">
                                    ${job.cargo} <span class="resaltado-empresa">@ ${job.empresa}</span>
                                </h3>
                                <p class="rango-fecha">${job.periodo}</p>
                                <ul class="lista-logros">
                                    ${job.logros.map(logro => `<li>${logro}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
    `;

    contenedor.innerHTML = contenido;

    // Lógica de interacción de pestañas
    const tabs = contenedor.querySelectorAll('.boton-tab');
    const paneles = contenedor.querySelectorAll('.panel-experiencia');
    const indicador = contenedor.querySelector('.indicador-movil');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => { t.classList.remove('activo'); t.setAttribute('aria-selected', 'false'); });
            paneles.forEach(p => p.classList.remove('visible'));
            
            tab.classList.add('activo');
            tab.setAttribute('aria-selected', 'true');
            document.getElementById(`panel-${tab.dataset.id}`).classList.add('visible');

            // Mover el indicador (42px es la altura estándar del botón)
            const moveY = index * 42;
            const moveX = index * 120; // Para móvil
            if (window.innerWidth > 768) {
                indicador.style.transform = `translateY(${moveY}px)`;
            } else {
                indicador.style.transform = `translateX(${moveX}px)`;
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', () => renderizarExperiencia('seccion-2-experiencia'));