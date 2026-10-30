
import express from 'express';
import cors from 'cors';

// Crear la aplicación Express
const app = express();

// Definir el puerto del servidor
const PORT = 3000;

// Permitir solicitudes desde Angular
app.use(cors({
  origin: 'http://localhost:4200'
}));

// Permitir recibir datos en formato JSON
app.use(express.json());

// Ruta para comprobar que la API funciona
app.get('/api/salud', (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: 'API de soporte técnico funcionando'
  });
});

// Responder cuando una ruta no existe
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(
    `Servidor funcionando en http://localhost:${PORT}`
  );
});
