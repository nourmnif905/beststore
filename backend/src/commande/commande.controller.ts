// src/commande/commande.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CreateCommandeDto } from './dto/create-commande.dto';

@Controller('commandes')
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

  @Post('create')
  create(@Body() dto: CreateCommandeDto) {
    return this.commandeService.create(dto);
  }

  @Get('getAllCommandes')
  findAll() {
    return this.commandeService.findAll();
  }

  @Get('getCommandeById/:id')
  findOne(@Param('id') id: string) {
    return this.commandeService.findOne(id);
  }
  @Get('getProducts/:id')
async getCommandeProducts(@Param('id') id: string) {
  return this.commandeService.getProductsInCommande(id);
}
}
