
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


function validarTicket(datos) {

  if (!datos || typeof datos !== 'object' ||
      Array.isArray(datos)) {
    return 'Debes enviar un objeto JSON válido';
  }

  const campos = [
    'asunto',
    'solicitante',
    'descripcion',
    'categoria',
    'prioridad',
    'estado'
  ];

  // Comprobar los campos obligatorios
  for (const campo of campos) {
    if (
      typeof datos[campo] !== 'string' ||
      datos[campo].trim() === ''
    ) {
      return `El campo ${campo} es obligatorio`;
    }
  }

  // Validar las longitudes
  if (
    datos.asunto.trim().length < 5 ||
    datos.asunto.trim().length > 150
  ) {
    return 'El asunto debe tener entre 5 y 150 caracteres';
  }

  if (datos.solicitante.trim().length > 100) {
    return 'El solicitante admite máximo 100 caracteres';
  }

  if (datos.descripcion.trim().length < 10) {
    return 'La descripción debe tener al menos 10 caracteres';
  }

  // Comprobar los valores permitidos
  const categorias = ['Hardware', 'Software', 'Redes', 'Otros'];
  const prioridades = ['Baja', 'Media', 'Alta'];
  const estados = ['Pendiente', 'En proceso', 'Resuelto'];

  if (!categorias.includes(datos.categoria.trim())) {
    return 'Categoría no válida';
  }

  if (!prioridades.includes(datos.prioridad.trim())) {
    return 'Prioridad no válida';
  }

  if (!estados.includes(datos.estado.trim())) {
    return 'Estado no válido';
  }

  return null;
}


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



app.get('/api/tickets/:id', async (req, res) => {
  try {

    const id = Number(req.params.id);

    // Comprobar que el ID sea válido
    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'ID no válido'
      });
    }

    // Buscar el ticket en MySQL
    const [filas] = await pool.execute(
      'SELECT * FROM tickets WHERE id = ?',
      [id]
    );

    // Si no existe, responder 404
    if (filas.length === 0) {
      return res.status(404).json({
        error: 'Ticket no encontrado'
      });
    }

    // Devolver el ticket encontrado
    res.status(200).json(filas[0]);

  } catch (error) {
    console.error('Error al consultar ticket:', error.message);

    res.status(500).json({
      error: 'No se pudo consultar el ticket'
    });
  }
});


app.post('/api/tickets', async (req, res) => {
  try {

    // Validar los datos recibidos
    const error = validarTicket(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    // Obtener los valores del formulario
    const {
      asunto,
      solicitante,
      descripcion,
      categoria,
      prioridad,
      estado
    } = req.body;

    // Insertar el nuevo ticket
    const [resultado] = await pool.execute(
      `INSERT INTO tickets
       (asunto, solicitante, descripcion,
        categoria, prioridad, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        asunto.trim(),
        solicitante.trim(),
        descripcion.trim(),
        categoria.trim(),
        prioridad.trim(),
        estado.trim()
      ]
    );

    // Consultar el ticket recién creado
    const [filas] = await pool.execute(
      'SELECT * FROM tickets WHERE id = ?',
      [resultado.insertId]
    );

    res.status(201).json({
      mensaje: 'Ticket creado correctamente',
      ticket: filas[0]
    });

  } catch (error) {
    console.error('Error al crear ticket:', error.message);

    res.status(500).json({
      error: 'No se pudo crear el ticket'
    });
  }
});


app.put('/api/tickets/:id', async (req, res) => {
  try {

    // Obtener el ID desde la URL
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'ID no válido'
      });
    }

    // Validar los datos enviados
    const error = validarTicket(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    // Comprobar si el ticket existe
    const [existe] = await pool.execute(
      'SELECT id FROM tickets WHERE id = ?',
      [id]
    );

    if (existe.length === 0) {
      return res.status(404).json({
        error: 'Ticket no encontrado'
      });
    }

    const {
      asunto,
      solicitante,
      descripcion,
      categoria,
      prioridad,
      estado
    } = req.body;

    // Actualizar el ticket
    await pool.execute(
      `UPDATE tickets
       SET asunto = ?,
           solicitante = ?,
           descripcion = ?,
           categoria = ?,
           prioridad = ?,
           estado = ?
       WHERE id = ?`,
      [
        asunto.trim(),
        solicitante.trim(),
        descripcion.trim(),
        categoria.trim(),
        prioridad.trim(),
        estado.trim(),
        id
      ]
    );

    // Consultar el ticket actualizado
    const [filas] = await pool.execute(
      'SELECT * FROM tickets WHERE id = ?',
      [id]
    );

    res.status(200).json({
      mensaje: 'Ticket actualizado correctamente',
      ticket: filas[0]
    });

  } catch (error) {
    console.error('Error al actualizar:', error.message);

    res.status(500).json({
      error: 'No se pudo actualizar el ticket'
    });
  }
});


app.delete('/api/tickets/:id', async (req, res) => {
  try {

    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        error: 'ID no válido'
      });
    }

    const [resultado] = await pool.execute(
      'DELETE FROM tickets WHERE id = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        error: 'Ticket no encontrado'
      });
    }

    res.status(200).json({
      mensaje: 'Ticket eliminado correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar:', error.message);

    res.status(500).json({
      error: 'No se pudo eliminar el ticket'
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
