const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Endpoint de registro
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });
    
    // Generar token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({ token, message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Usuario incorrecto' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

  // Token JWT de larga duración
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  res.json({ token });
});

module.exports = router;