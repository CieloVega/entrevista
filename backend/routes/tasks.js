const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const jwt = require('jsonwebtoken');

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// GET - Obtener todas las tareas del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId },
      orderBy: { id: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error obteniendo tasks:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// POST - Crear nueva tarea
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, status = 'PENDIENTE' } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Título requerido' });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        status,
        userId: req.user.userId
      }
    });
    res.json(task);
  } catch (error) {
    console.error('Error creando task:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// PUT - Actualizar tarea (mover estado)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (status !== undefined) updateData.status = status;

    const task = await prisma.task.update({
      where: { 
        id: parseInt(id),
        userId: req.user.userId // Solo permitir actualizar tareas propias
      },
      data: updateData
    });
    res.json(task);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    console.error('Error actualizando task:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// DELETE - Eliminar tarea
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.task.delete({
      where: { 
        id: parseInt(id),
        userId: req.user.userId // Solo permitir eliminar tareas propias
      }
    });
    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    console.error('Error eliminando task:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;