import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient({
  log:
    process.env.NODE_ENv === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('database connected');
  } catch (error) {
    console.error(
      `Database error: ${error instanceof Error ? error.message : 'unknown database connection error'}`,
    );
  }
};

const disconnectDB = async () => {
  prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };
