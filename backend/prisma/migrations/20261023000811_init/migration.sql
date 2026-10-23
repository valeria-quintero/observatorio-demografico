-- CreateTable
CREATE TABLE "Country" (
    "cca3" CHAR(3) NOT NULL,
    "name" TEXT NOT NULL,
    "capital" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "areaKm2" DOUBLE PRECISION NOT NULL,
    "density" DOUBLE PRECISION NOT NULL,
    "growthRate" DOUBLE PRECISION NOT NULL,
    "worldPercentage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("cca3")
);

-- CreateTable
CREATE TABLE "PopulationRecord" (
    "id" SERIAL NOT NULL,
    "countryCca3" CHAR(3) NOT NULL,
    "year" INTEGER NOT NULL,
    "population" BIGINT NOT NULL,

    CONSTRAINT "PopulationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Country_continent_idx" ON "Country"("continent");

-- CreateIndex
CREATE INDEX "PopulationRecord_year_idx" ON "PopulationRecord"("year");

-- CreateIndex
CREATE UNIQUE INDEX "PopulationRecord_countryCca3_year_key" ON "PopulationRecord"("countryCca3", "year");

-- AddForeignKey
ALTER TABLE "PopulationRecord" ADD CONSTRAINT "PopulationRecord_countryCca3_fkey" FOREIGN KEY ("countryCca3") REFERENCES "Country"("cca3") ON DELETE CASCADE ON UPDATE CASCADE;
