const fs = require('fs');

// Función para leer el token y el sign del archivo
function readTokenYSing() {
    try {
        const contenido = fs.readFileSync('token_sign.txt', 'utf8');
        const [, token, sign] = contenido.match(/Token: (.+)\nSign: (.+)/);
        return { token, sign };
    } catch (error) {
        console.error("Error al leer el archivo token_sign.txt:", error);
        throw error;
    }
}

const ctx = {
    idPersona:'20203032723',
    cuitRepresentada:'20435359974'
}

const requestWS = async (ctx) => {
    try {
        
        const { token, sign } = readTokenYSing();

        const url = 'https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA9';

        const message = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:a9="http://a9.soap.ws.server.puc.sr/">
                <soapenv:Header/>
                <soapenv:Body>
                    <a9:getPersona>
                        <token>${token}</token>
                        <sign>${sign}</sign>
                        <cuitRepresentada>${ctx.cuitRepresentada}</cuitRepresentada>
                        <idPersona>${ctx.idPersona}</idPersona>
                    </a9:getPersona>
                </soapenv:Body>
            </soapenv:Envelope>
        `;

        const config = {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Content-Type": "text/xml; charset=utf-8",
            },
            body: message
        };

        const response = await fetch(url, config);
        const data = await response.text();
        return data;
    } catch (error) {
        console.error("Error al hacer la solicitud al servicio web:", error);
        throw error;
    }
};

async function main() {
    try {
        const responseData = await requestWS(ctx);
        console.log("Respuesta del servicio web:", responseData);
    } catch (error) {
        console.error("Error en la función principal:", error);
        throw error;
    }
}

main();