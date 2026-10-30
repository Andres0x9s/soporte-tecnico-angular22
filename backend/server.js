
import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = 3000;

// Configuración
app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());

// Comprobar el servidor y la base de datos
app.get('/api/salud', async (req, res) => {
  try {
    await pool.execute('SELECT 1');

    res.status(200).json({
      ok: true,
      mensaje: 'API y MySQL funcionando'
    });

  } catch (error) {
    console.error('Error de conexión:', error.message);

    res.status(500).json({
      ok: false,
      mensaje: 'No se pudo conectar a MySQL'
    });
  }
});

// Consultar todos los tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const [tickets] = await pool.execute(
      'SELECT * FROM tickets ORDER BY id DESC'
    );

    res.status(200).json(tickets);

  } catch (error) {
    console.error('Error al consultar:', error.message);

    res.status(500).json({
      error: 'No se pudieron obtener los tickets'
    });
  }
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(
    `Servidor funcionando en http://localhost:${PORT}`
  );
});
