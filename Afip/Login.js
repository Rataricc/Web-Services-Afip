const fs = require('fs');
const cheerio = require('cheerio');

function cleanFile(archivo) {
    try {
        // Leer el contenido del archivo
        let contenido = fs.readFileSync(archivo, 'utf8');
        // Verificar si se está leyendo el contenido correctamente
        console.log("Contenido del archivo:", contenido);
        // Eliminar las líneas "-----BEGIN CMS-----" y "-----END CMS-----"
        contenido = contenido.replace(/-----BEGIN CMS-----|-----END CMS-----/g, '');
        // Limpiar espacios en blanco alrededor de la clave
        const claveLimpia = contenido.trim();
        return claveLimpia;
    } catch (error) {
        console.error("Error al leer el archivo:", error);
        throw error;
    }
};

function clearMessage() {
    const archivo = 'MiLoginTicketRequest.xml.txt'; 
    const exists = fs.existsSync(archivo); // Verificar si el archivo existe
    console.log("¿Existe el archivo?", exists);
    if (exists) {
        try {
            const messageLimpio = cleanFile(archivo);
            console.log("Mensaje limpio:", messageLimpio);
            fs.writeFileSync('clave.txt', messageLimpio);
            return messageLimpio; 
        } catch (error) {
            console.error("Error al limpiar el mensaje:", error);
            throw error; 
        };
    } else {
        console.log("El archivo no existe.");
    };
}; 

const loginAfip = async (encodeMessage) => {

    const url = 'https://wsaahomo.afip.gov.ar/ws/services/LoginCms';

    const message = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsaa="http://wsaa.view.sua.dvadac.desein.afip.gov">
            <soapenv:Header/>
            <soapenv:Body>
                <wsaa:loginCms>
                    <wsaa:in0>${encodeMessage}</wsaa:in0>
                </wsaa:loginCms>
            </soapenv:Body>
        </soapenv:Envelope>
    `;

    const config = {
        method: "POST",
        headers: {
            "Accept": "*/*",
            "Content-Type": "text/xml; charset=utf-8",
            "SOAPAction": "http://tempuri.org"
        },
        body: message
    }; 
    try {
        const response = await fetch(url, config);
        const data = await response.text();
        return data;
    } catch (error) {
        console.error("Error, esto no funciono para nada: ", error);
        throw error;
    };
};

function extraerDatosRespuesta(xmlResponse) {
    const $ = cheerio.load(xmlResponse, { xmlMode: true });
    const loginCmsReturn = $('loginCmsReturn').text();

    const $loginTicketResponse = cheerio.load(loginCmsReturn, { xmlMode: true });
    const token = $loginTicketResponse('token').text();
    const sign = $loginTicketResponse('sign').text();

    return { token, sign };
};

function guardarTokenYSing(token, sign) {
    try {
        // Crear un archivo de texto y escribir el token y sign
        fs.writeFileSync('token_sign.txt', `Token: ${token}\nSign: ${sign}`);
        console.log("Token y sign guardados en token_sign.txt");
    } catch (error) {
        console.error("Error al guardar el token y el sign:", error);
        throw error;
    }; 
}; 
 
async function main () {
    try {
        // Paso 1: Limpiar el mensaje y guardar en un archivo
        const mensajeLimpo = clearMessage();
        // Paso 2: Iniciar sesión en AFIP y obtener la respuesta
        const respuestaAfip = await loginAfip(mensajeLimpo);
        // Paso 3: Extraer token y sign de la respuesta XML
        const { token, sign } = extraerDatosRespuesta(respuestaAfip);
        // Paso 4: Guardar token y sign en un archivo de texto
        guardarTokenYSing(token, sign);
    } catch (error) {
        console.error("Error: ", error);
        throw error; 
    }; 
}; 

main(); 