const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createUser() {
  try {
    // Datos del usuario
    const username = 'holis@example.com';
    const password = 'prueba';
    
    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      console.log('❌ El usuario ya existe, eliminándolo primero...');
      await prisma.user.delete({ where: { username } });
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
    
    console.log('✅ Usuario creado exitosamente:');
    console.log('ID:', user.id);
    console.log('Username:', user.username);
    console.log('Password encriptada:', user.password.substring(0, 20) + '...');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();