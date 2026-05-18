const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PUERTO = Number(process.env.PORT || 3000);
const RAIZ_PUBLICA = __dirname;
const CARPETA_MENSAJES = path.join(__dirname, 'mensajes-locales');
const ARCHIVO_MENSAJES = path.join(CARPETA_MENSAJES, 'mensajes.jsonl');

const TIPOS_MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf'
};

const enviarJson = (respuesta, estado, datos) => {
    respuesta.writeHead(estado, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    respuesta.end(JSON.stringify(datos));
};

const limpiarTexto = (valor, maximo = 1000) => {
    return String(valor || '').replace(/\s+/g, ' ').trim().slice(0, maximo);
};

const leerCuerpo = (peticion) => new Promise((resolve, reject) => {
    let cuerpo = '';

    peticion.on('data', (fragmento) => {
        cuerpo += fragmento;
        if (cuerpo.length > 1024 * 64) {
            peticion.destroy();
            reject(new Error('El mensaje es demasiado grande.'));
        }
    });

    peticion.on('end', () => resolve(cuerpo));
    peticion.on('error', reject);
});

const parsearCuerpo = (cuerpo, tipoContenido) => {
    if (tipoContenido.includes('application/json')) {
        return JSON.parse(cuerpo || '{}');
    }

    const parametros = new URLSearchParams(cuerpo);
    return Object.fromEntries(parametros.entries());
};

const manejarMensaje = async (peticion, respuesta) => {
    try {
        const cuerpo = await leerCuerpo(peticion);
        const datos = parsearCuerpo(cuerpo, peticion.headers['content-type'] || '');

        const mensaje = {
            fecha: new Date().toISOString(),
            nombre: limpiarTexto(datos.name, 120),
            email: limpiarTexto(datos.email, 180),
            asunto: limpiarTexto(datos._subject, 180),
            mensaje: limpiarTexto(datos.message, 4000),
            ip: peticion.socket.remoteAddress
        };

        if (!mensaje.nombre || !mensaje.email || !mensaje.asunto || !mensaje.mensaje) {
            return enviarJson(respuesta, 400, { ok: false, error: 'Completa todos los campos.' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mensaje.email)) {
            return enviarJson(respuesta, 400, { ok: false, error: 'El correo no es valido.' });
        }

        fs.mkdirSync(CARPETA_MENSAJES, { recursive: true });
        fs.appendFileSync(ARCHIVO_MENSAJES, `${JSON.stringify(mensaje)}\n`, 'utf8');

        return enviarJson(respuesta, 200, { ok: true, mensaje: 'Mensaje recibido.' });
    } catch (error) {
        console.error('Error recibiendo mensaje:', error);
        return enviarJson(respuesta, 500, { ok: false, error: 'Error interno del servidor.' });
    }
};

const servirArchivo = (peticion, respuesta) => {
    const url = new URL(peticion.url, `http://${peticion.headers.host}`);
    const rutaSolicitada = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const rutaArchivo = path.normalize(path.join(RAIZ_PUBLICA, rutaSolicitada));
    const rutaRelativa = path.relative(RAIZ_PUBLICA, rutaArchivo);

    if (rutaRelativa.startsWith('..') || path.isAbsolute(rutaRelativa)) {
        respuesta.writeHead(403);
        return respuesta.end('Acceso denegado');
    }

    fs.readFile(rutaArchivo, (error, contenido) => {
        if (error) {
            respuesta.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return respuesta.end('Archivo no encontrado');
        }

        const extension = path.extname(rutaArchivo).toLowerCase();
        respuesta.writeHead(200, {
            'Content-Type': TIPOS_MIME[extension] || 'application/octet-stream',
            'Cache-Control': 'no-store'
        });
        respuesta.end(contenido);
    });
};

const servidor = http.createServer((peticion, respuesta) => {
    if (peticion.method === 'POST' && peticion.url.startsWith('/api/mensajes')) {
        return manejarMensaje(peticion, respuesta);
    }

    if (peticion.method === 'GET' || peticion.method === 'HEAD') {
        return servirArchivo(peticion, respuesta);
    }

    respuesta.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    respuesta.end('Metodo no permitido');
});

servidor.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`El puerto ${PUERTO} ya esta en uso.`);
        console.error(`Si la pagina abre en http://localhost:${PUERTO}, el servidor ya esta funcionando.`);
        console.error('Para usar otro puerto ejecuta, por ejemplo: $env:PORT=3001; npm run dev');
        process.exit(1);
    }

    console.error('No se pudo iniciar el servidor local:', error.message);
    process.exit(1);
});

servidor.listen(PUERTO, () => {
    console.log(`Portafolio local en http://localhost:${PUERTO}`);
    console.log(`Mensajes guardados en ${ARCHIVO_MENSAJES}`);
});
