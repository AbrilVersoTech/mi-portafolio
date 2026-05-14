/**
 * Renderiza la Sección 03: Proyectos.
 * Incluye una galería de tres proyectos específicos y una esfera 3D interactiva de tecnologías.
 * Estética unificada con el resto del portafolio.
 */
const renderizarProyectos = (idContenedor) => {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    // Proyectos específicos solicitados
    const proyectos = [
        {
            titulo: "Red Social",
            descripcion: "Plataforma interactiva con gestión de perfiles, publicaciones y mensajería interna, optimizada para una navegación fluida.",
            tech: ["HTML", "CSS", "JavaScript", "MySQL"]
        },
        {
            titulo: "Generador de Carátulas",
            descripcion: "Herramienta web avanzada para la creación de materiales educativos personalizados con almacenamiento persistente.",
            tech: ["React", "MySQL", "UI Design"]
        },
        {
            titulo: "Automatizaciones con n8n",
            descripcion: "Optimización de flujos de trabajo digitales mediante la integración de servicios y procesamiento automatizado de datos.",
            tech: ["n8n", "Node.js", "Automation"]
        }
    ];

    const tagsTecnologias = [
        'HTML', 'CSS', 'JavaScript', 'TypeScript', 'ReactJS', 'Next.js', 'Node.js', 
        'Docker', 'PostgreSQL', 'Prisma', 'Redis', 'Tailwind', 'Git', 'Python', 
        'GSAP', 'npm', 'ES6', 'MySQL', 'JSON', 'n8n', 'NextAuth', 'API'
    ];

    const contenido = `
        <section id="proyectos" class="seccion-proyectos">
            <div class="contenedor-proyectos">
                <h2 class="titulo-seccion">
                    <span class="numero-titulo">03.</span> Algunos proyectos realizados
                </h2>

                <div class="layout-proyectos">
                    <div class="lista-proyectos">
                        ${proyectos.map(p => `
                            <div class="tarjeta-proyecto">
                                <h3 class="titulo-proyecto">${p.titulo}</h3>
                                <p class="desc-proyecto">${p.descripcion}</p>
                                <div class="tech-proyecto">
                                    ${p.tech.map(t => `<span>${t}</span>`).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="contenedor-esfera">
                        <div class="tagcloud-esfera">
                            ${tagsTecnologias.map(tag => `<span class="tag-item">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    contenedor.innerHTML = contenido;
    
    // Iniciamos la esfera con un leve retardo para asegurar el renderizado de los elementos
    setTimeout(iniciarEsfera3D, 50);
};

/**
 * Lógica para simular la rotación de la esfera 3D de palabras
 */
const iniciarEsfera3D = () => {
    const tags = document.querySelectorAll('.tag-item');
    const container = document.querySelector('.tagcloud-esfera');
    if (!container || tags.length === 0) return;

    let radius = window.innerWidth > 768 ? 200 : 130;
    
    // Distribución matemática de los elementos en la superficie de una esfera
    tags.forEach((tag, i) => {
        const phi = Math.acos(-1 + (2 * i) / tags.length);
        const theta = Math.sqrt(tags.length * Math.PI) * phi;
        
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        tag.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        // Ajuste de opacidad basado en la profundidad (Z)
        tag.style.opacity = (z + radius) / (2 * radius) + 0.3;
    });

    // Animación de rotación continua
    let angle = 0;
    const animar = () => {
        angle += 0.005;
        container.style.transform = `rotateY(${angle}rad) rotateX(${angle * 0.5}rad)`;
        requestAnimationFrame(animar);
    };
    animar();
};

// Registro del evento para el renderizado inicial
document.addEventListener('DOMContentLoaded', () => {
    renderizarProyectos('seccion-3-proyectos');
});