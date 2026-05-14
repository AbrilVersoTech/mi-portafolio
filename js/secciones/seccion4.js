/**
 * Renderiza la Sección 04: Contacto.
 * Corrección: Envío vía FormData para evitar CORS y reactivación de dominio.
 */
const renderizarContacto = (idContenedor) => {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    // Mensaje de WhatsApp estructurado
    const mensajeWA = encodeURIComponent(
        "¡Hola Diego! Me interesa tu perfil profesional y me gustaría ponerme en contacto.\n\n" +
        "Mis datos son:\n" +
        "- Nombre:\n" +
        "- Correo:\n" +
        "- Número:\n\n" +
        "Lo que necesito es: "
    );

    const contenido = `
        <section id="contacto" class="seccion-contacto">
            <div class="contenedor-contacto">
                <h2 class="titulo-seccion">
                    <span class="numero-titulo">04.</span> Contacto
                </h2>
                
                <div class="bloque-contacto">
                    <h3 class="subtitulo-contacto">Ponerse en contacto</h3>
                    <p class="texto-contacto">
                        Actualmente estoy en busca de nuevas oportunidades como <strong>Ingeniero en TI</strong> o <strong>Desarrollador Full-Stack</strong>. Si tienes alguna pregunta, ¡mi bandeja de entrada siempre está abierta!
                    </p>

                    <form class="formulario-contacto" id="form-contacto">
                        <input type="hidden" name="_captcha" value="false">
                        <input type="hidden" name="_template" value="table">
                        
                        <div class="grupo-input">
                            <input type="text" id="nombre" placeholder="Tu nombre" required>
                            <input type="email" id="email" placeholder="Tu correo" required>
                        </div>
                        <input type="text" id="asunto" placeholder="Asunto" required>
                        <textarea id="mensaje" placeholder="Tu mensaje..." rows="5" required></textarea>
                        
                        <button type="submit" class="boton-enviar-neon" id="btn-enviar">
                            <span class="btn-texto">Enviar Mensaje</span>
                        </button>

                        <div id="form-status" class="estado-envio"></div>
                    </form>

                    <div class="contenedor-whatsapp">
                        <p class="texto-separador">o también puedes escribirme por:</p>
                        <a href="https://wa.me/593987847201?text=${mensajeWA}" 
                           class="enlace-whatsapp" 
                           target="_blank" 
                           aria-label="Escribir por WhatsApp">
                            <svg width="35" height="35" viewBox="0 0 448 512" fill="currentColor" class="svg-whatsapp">
                                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.2 106.2 27.2h.1c122.3 0 222-99.6 222-222 0-59.3-23-115.1-65.1-157.1zM223.9 446.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 367.1l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.4-11.3 2.5-2.4 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.5 5.5-9.2 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    `;

    contenedor.innerHTML = contenido;

    const formulario = document.getElementById('form-contacto');
    const status = document.getElementById('form-status');
    const btnTexto = document.querySelector('.btn-texto');

    if (formulario) {
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            btnTexto.innerText = "Enviando...";
            formulario.style.pointerEvents = "none";
            formulario.style.opacity = "0.7";

            // Implementación de FormData para simplificar la petición y evitar preflight CORS
            const data = new FormData();
            data.append('Nombre', document.getElementById('nombre').value);
            data.append('Email', document.getElementById('email').value);
            data.append('Asunto', document.getElementById('asunto').value);
            data.append('Mensaje', document.getElementById('mensaje').value);

            try {
                // Usamos el correo directamente para la reactivación en el nuevo dominio del VPS
                const response = await fetch("https://formsubmit.co/ajax/abrildiazdiego2017@gmail.com", {
                    method: "POST",
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.innerHTML = "¡Mensaje enviado con éxito!";
                    status.className = "estado-envio exito";
                    formulario.reset();
                } else {
                    throw new Error();
                }
            } catch (error) {
                status.innerHTML = "Ocurrió un error. Inténtalo de nuevo.";
                status.className = "estado-envio error";
            } finally {
                btnTexto.innerText = "Enviar Mensaje";
                formulario.style.pointerEvents = "auto";
                formulario.style.opacity = "1";
                
                setTimeout(() => {
                    status.innerHTML = "";
                    status.className = "estado-envio";
                }, 5000);
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderizarContacto('seccion-4-contacto');
});