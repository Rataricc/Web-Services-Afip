const { exec } = require('child_process');
const fs = require('fs');

function generarFechaFormateada(fecha) {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minuto = String(fecha.getMinutes()).padStart(2, '0');
    const segundo = String(fecha.getSeconds()).padStart(2, '0');

    return `${año}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
};

function generarLoginTicketRequest() {

    const uniqueId = new Date().getTime().toString().substring(0, 6);
    const generationTime = new Date();
    const expirationTime = new Date(generationTime.getTime()); // Clonar la fecha de generación
    expirationTime.setHours(expirationTime.getHours() + 12); // Agregar 12 horas a la fecha de expiración

    const formattedGenerationTime = generarFechaFormateada(generationTime);
    const formattedExpirationTime = generarFechaFormateada(expirationTime);

    const service = 'ws_sr_padron_a9'; 
    //const service = 'trabajo_f931'; 

    const xmlSolicitud = `
        <loginTicketRequest>
            <header>
                <uniqueId>${uniqueId}</uniqueId>
                <generationTime>${formattedGenerationTime}</generationTime>
                <expirationTime>${formattedExpirationTime}</expirationTime>
            </header>
            <service>${service}</service>
        </loginTicketRequest>
    `;

    // Ejecutar el comando
    fs.writeFileSync('temp.xml', xmlSolicitud);
    // Comando de OpenSSL
    const comando = 'openssl cms -sign -in temp.xml -out MiLoginTicketRequest.xml.txt -signer certificado.pem -inkey pkAfip.key -nodetach -outform PEM';
    // Ejecutar el comando
    exec(comando, (error, stdout, stderr) => {
        try {
            // Eliminar el archivo temporal después de que se complete la ejecución del comando
            //fs.unlinkSync('temp.xml');
            if (error) {
                console.error(`Error al ejecutar el comando: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error en la salida estándar: ${stderr}`);
                return;
            }
            console.log(`Archivo MiLoginTicketRequest.xml.txt generado con éxito: ${stdout} Ok`);

        } catch (error) {
            console.error("Error: ", error);
            throw error;
        }
    });
};

generarLoginTicketRequest();