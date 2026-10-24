import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// JSON no sabe convertir BigInt: sin esto, devolver una población lanzaría un error.
// Las poblaciones caben en un Number, así que se envían como número.
declare global {
  interface BigInt {
    toJSON(): number;
  }
}
BigInt.prototype.toJSON = function () {
  return Number(this);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Todas las rutas empiezan con /api (ej. /api/demographics/countries)
  app.setGlobalPrefix('api');

  // Permite que el frontend (Vite, puerto 5173) llame a esta API desde el navegador
  app.enableCors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
