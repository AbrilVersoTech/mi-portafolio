/**
 * Renderiza la sección de Pie de Página con 4 redes sociales y copyright.
 */
const renderizarPiePagina = (idContenedor) => {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;

    const contenido = `
        <footer class="seccion-pie-pagina">
            <div class="contenedor-pie">
                <div class="redes-sociales-pie">
                    <a href="https://www.tiktok.com/@abrlverso" target="_blank" aria-label="TikTok" class="enlace-red">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                    </a>
                    <a href="https://www.instagram.com/abrilverso_oficial/" target="_blank" aria-label="Instagram" class="enlace-red">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=61576624422734" target="_blank" aria-label="Facebook" class="enlace-red">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="https://www.linkedin.com/in/diego-abril-d%C3%ADaz-311103360/" target="_blank" aria-label="LinkedIn" class="enlace-red">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                </div>
                
                <div class="creditos-pie">
                    <p class="copyright">© Derechos Reservados</p>
                </div>
            </div>
        </footer>
    `;

    contenedor.innerHTML = contenido;
};

document.addEventListener('DOMContentLoaded', () => {
    renderizarPiePagina('seccion-5-piepagina');
});