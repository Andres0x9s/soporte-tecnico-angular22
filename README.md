
# Sistema de Gestión de Soporte Técnico

## Descripción

Aplicación web full stack desarrollada para registrar
y administrar solicitudes de soporte técnico.

El sistema permite realizar operaciones CRUD sobre
tickets, utilizando Angular 22, Node.js, Express y MySQL.

## Autor

Andrés Saldias
Ingeniería en Informática
Instituto Profesional Virginio Gómez - Sede Chillán
Asignatura: Electivo Angular

## Tecnologías utilizadas

- Angular 22: interfaz web.
- TypeScript: lógica del frontend.
- HTML y CSS: estructura y estilos.
- Node.js: entorno de ejecución del backend.
- Express: API REST.
- MySQL: base de datos persistente.
- MySQL2: conexión y consultas SQL.
- Git y GitHub: control de versiones.

## Estructura del proyecto

- frontend/: aplicación Angular.
- backend/: servidor Express y API REST.
- database/: script SQL para crear la base de datos.

## Requisitos de instalación

- Node.js compatible con Angular 22.
- npm.
- MySQL Server.
- Navegador web.

## Instalación

1. Clonar el repositorio:

   https://github.com/Andres0x9s/soporte-tecnico-angular22.git

2. Entrar a la carpeta del proyecto.

3. Abrir MySQL Workbench.

4. Ejecutar database/01-crear-base.sql.

5. Entrar a backend e instalar dependencias:

   cd backend
   npm install

6. Crear backend/.env usando .env.example
   como referencia. Configurar las credenciales
   locales de MySQL.

7. Iniciar Express:

   npm run dev

8. En otra terminal, entrar a frontend:

   cd frontend
   npm install

9. Iniciar Angular:

   npx ng serve

10. Abrir http://localhost:4200

## Configuración

Frontend: http://localhost:4200
Backend: http://localhost:3000
Base de datos: soporte_tecnico

## Funcionalidades

- Listar tickets registrados.
- Crear nuevos tickets.
- Consultar tickets por identificador.
- Editar tickets existentes.
- Eliminar tickets con confirmación.
- Validar campos obligatorios.
- Distinguir visualmente estados y prioridades.
- Mostrar mensajes de error.
- Mantener datos almacenados en MySQL.

## API REST

GET /api/salud
Comprueba la conexión con MySQL.

GET /api/tickets
Obtiene todos los tickets.

GET /api/tickets/:id
Obtiene un ticket específico.

POST /api/tickets
Crea un nuevo ticket.

PUT /api/tickets/:id
Actualiza un ticket.

DELETE /api/tickets/:id
Elimina un ticket.

## Modelo de datos

Tabla: tickets

- id: identificador único.
- asunto: resumen de la solicitud.
- solicitante: nombre del solicitante.
- descripcion: detalle del problema.
- categoria: Hardware, Software, Redes u Otros.
- prioridad: Baja, Media o Alta.
- estado: Pendiente, En proceso o Resuelto.
- fechaRegistro: fecha de creación.

## Pruebas funcionales

Las comprobaciones que se deben realizar son:

1. GET: consultar los tickets existentes.
2. POST: crear un ticket desde Angular.
3. PUT: modificar un ticket y recargar la página.
4. DELETE: eliminar un ticket previa confirmación.
5. Validación: enviar campos incompletos.
6. Errores: detener Express y comprobar el mensaje.
7. Persistencia: reiniciar la API y consultar los datos.

Registrar únicamente como realizadas las pruebas
que se hayan ejecutado y comprobado.

## Uso de Inteligencia Artificial

Herramienta utilizada: ChatGPT.

Se utilizó como apoyo educativo y técnico para:

- Comprender la arquitectura Angular, Express y MySQL.
- Recibir explicaciones de componentes y servicios.
- Proponer ejemplos de formularios y validaciones.
- Apoyar la construcción de endpoints REST.
- Comprender consultas SQL parametrizadas.
- Orientar la integración HTTP y la depuración.
- Apoyar la elaboración de documentación.

El desarrollo fue realizado de forma incremental
con asistencia de IA. El código incorporado debe
ser revisado, probado y comprendido por el autor.

Modificaciones y verificaciones realizadas:
Durante el desarrollo se configuraron y adaptaron los archivos del frontend, backend y base de datos a la estructura del proyecto. Se realizaron pruebas de funcionamiento de las operaciones CRUD, validaciones de formularios, comunicación entre Angular y Express y persistencia de datos en MySQL.

Además, se revisó el código implementado para comprender su funcionamiento y la relación entre los componentes del sistema.
