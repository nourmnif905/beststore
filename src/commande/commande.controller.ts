import { Controller } from '@nestjs/common';
import { CommandeService } from './commande.service';

@Controller('commande')
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}
}
