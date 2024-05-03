# Pasos a seguir para ejecutar los scripts para obtener accesos a los servicios de Afip. 
# WebServices Afip.
## TESTING/HOMOLOGACIÓN.

**Dependencias**

`npm install openssl`
`npm install fs`
`npm install cheerio`

**PRIMER PASO**
1. *Asegurarse de tener instalado openssl y todas las dependecias que se solicitan*
2. *Una vez se verifiquen y se instalen las dependencias, correr el primer archivo llamado:*
`GenerarClaveYCSR.js`
3. *Una vez ejecute el script, esto le creara un archivo llamado **MiPedidoCSR.pem** en este caso. (asi esta en el script)*
4. *Copie el contenido del archivo, y pase al segundo **Paso**.*

**SEGUNDO PASO**
1. *Acceder al stio de afip con su clave fiscal.*
*[Stio Afip](https://auth.afip.gob.ar/contribuyente_/login.xhtml)*
2. *Una vez dentro, fijarse en la parte de servicios, si tiene alguno con el siguiente nombre:*
**WSASS - AUTOGESTIÓN CERTIFICADOS HOMOLOGACIÓN**

*Si lo tiene:*
1. *Accede a el haciendo clic.* 
2. *Nuevo certificado.*
3. *Seguir los pasos que dice en el formulario.*
4. *Donde dice solicitud de turno: > Solicitud de certificado en formato PKCS#10.*
5. *Copie y pege el token generado que se encuentra en el archivo creado: **MiPedidoCSR.pem**.*
6. *Y por ultimo dandole clic al boton **Crear DN y Obtener certificado** le devolvera una token.*
7. *Copie el token generado en un archivo txt.*
8. *Agregue el archivo txt creado, con el token generado en la pagina de afip en la raiz del proyecto (en este caso el nombre que tiene el script es **certificado.pem**).*

*Si **no** lo tiene:*
1. *Dirigirse a **Administrador de relaciones** (en la la parte superior de la pagina de inicio)*
2. *Una vez ahi, seleccione la opcion **Adherir Servicio**.*
3. *Seleccione la opcion de Afip/ WebServices.*
4. *Homolagación se encuentra abajo de todo, seleccione esa opcion y siga los pasos correspondientes.*
5. *Una vez que haya seguido los pasos correspondientes, el servicio aparecera en su inicio de afip.*

**TERCER PASO**
1. *Ejecutar el Segundo script, llamado:*
`GenerarLoginTicket.js`
2. *Una vez ejecutado el script, se le generara dos archivos, uno llamado 'temp.xml' y el otro 'MiLoginTicketRequest.xml.txt'.*

**CUARTO PASO**
1. *Ejecutar el tercer Script, llamado:*
`Login.js`
2. *Esto generara un archivo token_sign.txt, para que despues sea extraido (token y sign) para poder hacer la solicutud.*
3. *Si todo sale bien, el script devolvera un mensaje con una clave en base 64 limpia que seria el certificado generado.*
4. *La clave y el token son extraidos de la respuesta del servicio login afip ejecutado en este script.*

**QUINTO PASO**
1. *Ejecutar el cuarto script que tiene como nombre:*
`Services.js`
2. *Si todos los pasos anteriores se realizaron al pie de la letra, este script ni bien se ejecute, tednria que devolverle la respuesta del servicio al cual quieran llamar.*