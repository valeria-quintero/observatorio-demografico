import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'csv-parse/sync';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

// Prisma 7 se conecta a Postgres a través de un adaptador (driver "pg")
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Años que trae el CSV, una columna "<año> Population" por cada uno
const YEARS = [1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022];

async function main() {
  // Lee el CSV y lo convierte en un arreglo de objetos (clave = nombre de columna)
  const csv = readFileSync(join(import.meta.dirname, 'data', 'world_population.csv'));
  const rows = parse(csv, { columns: true, skip_empty_lines: true }) as Record<string, string>[];

  // Un país por fila del CSV
  const countries = rows.map((r) => ({
    cca3: r['CCA3'],
    name: r['Country/Territory'],
    capital: r['Capital'],
    continent: r['Continent'],
    areaKm2: Number(r['Area (km²)']),
    density: Number(r['Density (per km²)']),
    growthRate: Number(r['Growth Rate']),
    worldPercentage: Number(r['World Population Percentage']),
  }));

  // Pasa las columnas de años a filas: un registro por país y año
  const records = rows.flatMap((r) =>
    YEARS.map((year) => ({
      countryCca3: r['CCA3'],
      year,
      population: BigInt(r[`${year} Population`]), // BigInt: algunas cifras superan 2^31
    })),
  );

  // skipDuplicates evita errores (y duplicados) si el seed se ejecuta más de una vez
  const c = await prisma.country.createMany({ data: countries, skipDuplicates: true });
  const p = await prisma.populationRecord.createMany({ data: records, skipDuplicates: true });

  console.log(`Países insertados: ${c.count}`);
  console.log(`Registros de población insertados: ${p.count}`);
}

main()
  .catch((e) => {
    console.error(e);
    //0 es éxito, cualquier otro número es fallo
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect()); // cierra la conexión para que el proceso termine
