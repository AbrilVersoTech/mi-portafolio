const http = require('http');
const fs = require('fs');
const path = require('path');
const net = require('net');
const tls = require('tls');
const { URL } = require('url');

const cargarEnvLocal = () => {
    const rutaEnv = path.join(__dirname, '.env');
    if (!fs.existsSync(rutaEnv)) return;

    const lineas = fs.readFileSync(rutaEnv, 'utf8').split(/\r?\n/);
    lineas.forEach((linea) => {
        const limpia = linea.trim();
        if (!limpia || limpia.startsWith('#') || !limpia.includes('=')) return;

        const indice = limpia.indexOf('=');
        const clave = limpia.slice(0, indice).trim();
        const valor = limpia.slice(indice + 1).trim().replace(/^["']|["']$/g, '');

        if (clave && process.env[clave] === undefined) {
            process.env[clave] = valor;
        }
    });
};

cargarEnvLocal();

const PUERTO = Number(process.env.PORT || 3000);
const RAIZ_PUBLICA = __dirname;
const CARPETA_MENSAJES = path.join(__dirname, 'mensajes-locales');
const ARCHIVO_MENSAJES = path.join(CARPETA_MENSAJES, 'mensajes.jsonl');
const CORREO_DESTINO = process.env.MAIL_TO || 'abrldzdisrac0n2@gmail.com';
const normalizarSecreto = (valor) => {
    const secreto = String(valor || '').replace(/\s+/g, '').trim();
    return secreto === 'TU_APP_PASSWORD_DE_GMAIL' ? '' : secreto;
};
const SMTP_CONFIG = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || '',
    pass: normalizarSecreto(process.env.SMTP_PASS),
    from: process.env.MAIL_FROM || process.env.SMTP_USER || ''
};

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

const escaparHtml = (texto) => {
    return String(texto || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const crearCorreo = (mensaje) => {
    const asunto = `Portafolio: ${mensaje.asunto}`;
    const html = `
        <h2>Nuevo mensaje desde el portafolio</h2>
        <p><strong>Nombre:</strong> ${escaparHtml(mensaje.nombre)}</p>
        <p><strong>Correo:</strong> ${escaparHtml(mensaje.email)}</p>
        <p><strong>Asunto:</strong> ${escaparHtml(mensaje.asunto)}</p>
        <p><strong>Fecha:</strong> ${escaparHtml(mensaje.fecha)}</p>
        <hr>
        <p>${escaparHtml(mensaje.mensaje).replace(/\n/g, '<br>')}</p>
    `;
    const texto = [
        'Nuevo mensaje desde el portafolio',
        `Nombre: ${mensaje.nombre}`,
        `Correo: ${mensaje.email}`,
        `Asunto: ${mensaje.asunto}`,
        `Fecha: ${mensaje.fecha}`,
        '',
        mensaje.mensaje
    ].join('\n');

    return { asunto, html, texto };
};

const leerRespuestaSmtp = (socket) => new Promise((resolve, reject) => {
    let datos = '';

    const limpiar = () => {
        socket.off('data', recibir);
        socket.off('error', fallar);
    };

    const fallar = (error) => {
        limpiar();
        reject(error);
    };

    const recibir = (fragmento) => {
        datos += fragmento.toString('utf8');
        const lineas = datos.trimEnd().split(/\r?\n/);
        const ultima = lineas[lineas.length - 1] || '';

        if (/^\d{3} /.test(ultima)) {
            limpiar();
            resolve({ codigo: Number(ultima.slice(0, 3)), datos });
        }
    };

    socket.on('data', recibir);
    socket.on('error', fallar);
});

const comandoSmtp = async (socket, comando, codigosValidos) => {
    socket.write(`${comando}\r\n`);
    const respuesta = await leerRespuestaSmtp(socket);

    if (!codigosValidos.includes(respuesta.codigo)) {
        throw new Error(`SMTP rechazo "${comando.split(' ')[0]}": ${respuesta.datos.trim()}`);
    }

    return respuesta;
};

const marcarErrorSmtp = (error) => {
    error.tipo = 'SMTP_ENVIO';
    return error;
};

const conectarSmtpSeguro = () => new Promise((resolve, reject) => {
    const rechazar = (error) => reject(marcarErrorSmtp(error));

    if (SMTP_CONFIG.port === 465) {
        const socket = tls.connect({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            servername: SMTP_CONFIG.host,
            rejectUnauthorized: true
        });

        socket.setEncoding('utf8');
        socket.setTimeout(20000);

        socket.once('secureConnect', async () => {
            try {
                await leerRespuestaSmtp(socket);
                resolve(socket);
            } catch (error) {
                socket.destroy();
                rechazar(error);
            }
        });

        socket.once('timeout', () => {
            socket.destroy();
            rechazar(new Error('Tiempo de espera agotado conectando con SMTP.'));
        });
        socket.once('error', rechazar);
        return;
    }

    const socket = net.createConnection({
        host: SMTP_CONFIG.host,
        port: SMTP_CONFIG.port,
        timeout: 20000
    });

    socket.setEncoding('utf8');

    socket.once('connect', async () => {
        try {
            await leerRespuestaSmtp(socket);
            await comandoSmtp(socket, `EHLO ${SMTP_CONFIG.host}`, [250]);
            await comandoSmtp(socket, 'STARTTLS', [220]);
            socket.removeAllListeners('timeout');
            socket.removeAllListeners('error');

            const socketSeguro = tls.connect({
                socket,
                servername: SMTP_CONFIG.host,
                rejectUnauthorized: true
            });

            socketSeguro.setEncoding('utf8');
            socketSeguro.setTimeout(20000);
            socketSeguro.once('secureConnect', () => resolve(socketSeguro));
            socketSeguro.once('timeout', () => {
                socketSeguro.destroy();
                rechazar(new Error('Tiempo de espera agotado conectando con SMTP seguro.'));
            });
            socketSeguro.once('error', rechazar);
        } catch (error) {
            socket.destroy();
            rechazar(error);
        }
    });

    socket.once('timeout', () => {
        socket.destroy();
        rechazar(new Error('Tiempo de espera agotado conectando con SMTP.'));
    });
    socket.once('error', rechazar);
});

const enviarCorreoSmtp = (mensaje) => new Promise((resolve, reject) => {
    if (!SMTP_CONFIG.user || !SMTP_CONFIG.pass || !SMTP_CONFIG.from) {
        const error = new Error('SMTP no configurado. Define SMTP_USER y SMTP_PASS.');
        error.tipo = 'SMTP_CONFIG';
        reject(error);
        return;
    }

    const correo = crearCorreo(mensaje);
    conectarSmtpSeguro()
        .then(async (socket) => {
            try {
                await comandoSmtp(socket, `EHLO ${SMTP_CONFIG.host}`, [250]);
                await comandoSmtp(socket, 'AUTH LOGIN', [334]);
                await comandoSmtp(socket, Buffer.from(SMTP_CONFIG.user).toString('base64'), [334]);
                await comandoSmtp(socket, Buffer.from(SMTP_CONFIG.pass).toString('base64'), [235]);
                await comandoSmtp(socket, `MAIL FROM:<${SMTP_CONFIG.from}>`, [250]);
                await comandoSmtp(socket, `RCPT TO:<${CORREO_DESTINO}>`, [250, 251]);
                await comandoSmtp(socket, 'DATA', [354]);

                const cuerpo = [
                    `From: Portafolio Abril <${SMTP_CONFIG.from}>`,
                    `To: ${CORREO_DESTINO}`,
                    `Reply-To: ${mensaje.nombre} <${mensaje.email}>`,
                    `Subject: ${correo.asunto}`,
                    'MIME-Version: 1.0',
                    'Content-Type: multipart/alternative; boundary="PORTAFOLIO_ABRIL"',
                    '',
                    '--PORTAFOLIO_ABRIL',
                    'Content-Type: text/plain; charset=UTF-8',
                    '',
                    correo.texto,
                    '',
                    '--PORTAFOLIO_ABRIL',
                    'Content-Type: text/html; charset=UTF-8',
                    '',
                    correo.html,
                    '',
                    '--PORTAFOLIO_ABRIL--',
                    '.'
                ].join('\r\n');

                await comandoSmtp(socket, cuerpo, [250]);
                await comandoSmtp(socket, 'QUIT', [221]);
                socket.end();
                resolve();
            } catch (error) {
                socket.destroy();
                reject(marcarErrorSmtp(error));
            }
        })
        .catch(reject);
});

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

        await enviarCorreoSmtp(mensaje);

        return enviarJson(respuesta, 200, { ok: true, mensaje: 'Mensaje enviado al correo.' });
    } catch (error) {
        console.error('Error recibiendo mensaje:', error);

        if (error.tipo === 'SMTP_CONFIG') {
            return enviarJson(respuesta, 503, {
                ok: false,
                error: 'El mensaje se guardo, pero falta configurar SMTP para enviarlo al correo.'
            });
        }

        if (error.tipo === 'SMTP_ENVIO') {
            return enviarJson(respuesta, 502, {
                ok: false,
                error: 'El mensaje se guardo, pero Gmail rechazo el envio SMTP. Revisa SMTP_USER y SMTP_PASS.'
            });
        }

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
    console.log(`Correo destino: ${CORREO_DESTINO}`);
    console.log(
        SMTP_CONFIG.user && SMTP_CONFIG.pass
            ? `SMTP activo: ${SMTP_CONFIG.user}`
            : 'SMTP pendiente: configura SMTP_USER y SMTP_PASS'
    );
});
