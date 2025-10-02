const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { username: 'holis@example.com' }
    });
    
    if (user) {
      console.log('✅ Usuario encontrado:');
      console.log('ID:', user.id);
      console.log('Username:', user.username);
      console.log('Password (primeros 10 chars):', user.password.substring(0, 10) + '...');
      console.log('Password length:', user.password.length);
      
      // Verificar si parece ser un hash de bcrypt
      if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
        console.log('✅ La contraseña parece estar hasheada con bcrypt');
      } else {
        console.log('❌ La contraseña NO está hasheada con bcrypt');
      }
    } else {
      console.log('❌ Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();