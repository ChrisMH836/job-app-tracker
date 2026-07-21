import { PrismaClient } from '../../generated/prisma';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');
const adapter = new PrismaPg({ connectionString });

const prisma: PrismaClient = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('DB connected via prisma');
  } catch (error) {
    console.error(
      `Database connect error: ${error instanceof Error ? error.message : 'unknown database Error'}`,
    );
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };
