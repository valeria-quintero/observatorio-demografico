import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { DemographicsService } from './demographics.service.js';

@Controller('demographics')
export class DemographicsController {
    constructor(private readonly demographicsService: DemographicsService) {}

    @Get('countries')
    findCountries(
        @Query('search') search?: string,
        @Query('continent') continent?: string,
    ) {
        return this.demographicsService.findCountries(search, continent);
    }

    @Get('history')
    historyCountries(
        @Query('countries') countries = ''
    ) {
        //pasa la lista a un arreglo
        const codes = countries
            .split(',')
            .map((c) => c.trim().toUpperCase())
            .filter(Boolean);

        //cada código debe tener exactamente 3 letras
        const invalid = codes.filter((c) => !/^[A-Z]{3}$/.test(c));
        if (invalid.length > 0) {
            throw new BadRequestException(`Códigos no válidos: ${invalid.join(', ')}`);
        }

        return this.demographicsService.historyCountries(codes);
    }

    @Get('continent-summary')
    continentSummary() {
        return this.demographicsService.continentSummary();
    }
}
