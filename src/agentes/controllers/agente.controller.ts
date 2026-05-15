import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { AgenteService } from "../services/agente.service";
import { CreateAgenteDto } from "../dto/create-agente.dto";
import { UpdateAgenteDto } from "../dto/update-agente.dto";

@Controller("/agentes")

export class AgenteController {

    constructor(
        private readonly agenteService: AgenteService
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll() {
        return this.agenteService.findAll()
    }

    @Get("/:id")
    @HttpCode(HttpStatus.OK)
    findById(@Param("id", ParseIntPipe) id: number) {
        return this.agenteService.findById(id)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() agente: CreateAgenteDto) {
        return this.agenteService.create(agente)
    }

    @Put("/:id")
    @HttpCode(HttpStatus.OK)
    update(@Param("id", ParseIntPipe) id: number, @Body() agente: UpdateAgenteDto) {
        return this.agenteService.update(id, agente)
    }

    @Delete("/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param("id", ParseIntPipe) id: number) {
        return this.agenteService.delete(id)
    }
}