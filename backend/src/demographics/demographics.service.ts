import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Country } from '../generated/prisma/client.js';

@Injectable()
export class DemographicsService {
    constructor(private readonly prisma: PrismaService) {} 

    async findCountries(search?: string, continent?: string): Promise<(Country & { population: number })[]> {
        const countries = await this.prisma.country.findMany({
            where: {
                //si hay texto, busca en el nombre O en el código, sin distinguir mayúsculas
                OR: search ? [
                        { name: { contains: search, mode: 'insensitive' } },
                        { cca3: { contains: search, mode: 'insensitive' } },
                    ] : undefined,
                //si no llega continente o llega vacío, no se filtra
                continent: continent || undefined,
            },
            orderBy: { name: 'asc' },
            //solo el registro de 2022, para saber la población actual
            include: { populationRecords: { where: { year: 2022 } } },
        });

        //deja la población como un número simple en cada país
        return countries.map(({ populationRecords, ...country }) => ({
            ...country,
            population: Number(populationRecords[0]?.population ?? 0),
        }));
    }

    async historyCountries(countries: string[]): Promise<Record<string, number>[]> {
        const records = await this.prisma.populationRecord.findMany({
            where: { countryCca3: { in: countries } },
            orderBy: { year: 'asc' },
        });

        // Agrupa por año: cada año es una fila y cada país una columna
        const byYear = new Map<number, Record<string, number>>();
        for (const r of records) {
            const row = byYear.get(r.year) ?? { year: r.year };
            row[r.countryCca3] = Number(r.population);
            byYear.set(r.year, row);
        }
        return [...byYear.values()];
    }

    async continentSummary(): Promise<{ continent: string; population: number }[]> {

        const rows = await this.prisma.$queryRaw<{ continent: string; population: bigint }[]>`
            SELECT c."continent", SUM(p."population")::bigint AS "population"
            FROM "PopulationRecord" p
            JOIN "Country" c ON c."cca3" = p."countryCca3"
            WHERE p."year" = 2022
            GROUP BY c."continent"
            ORDER BY "population" DESC
        `;
        return rows.map((r) => ({ continent: r.continent, population: Number(r.population) }));
    }

}
