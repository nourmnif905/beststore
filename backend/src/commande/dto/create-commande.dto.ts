// src/commande/dto/create-commande.dto.ts
import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateCommandeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  mail: string;

  @Min(10000000, { message: 'Phone number must be exactly 8 digits' })
  @Max(99999999, { message: 'Phone number must be exactly 8 digits' })
  @IsNotEmpty()
  @IsInt()
  phoneNumber:number ;

  @IsString()
  @IsNotEmpty()
  localisation: string;

  @IsString()
  @IsNotEmpty()
  cartId: string;


  @IsNotEmpty()
  @IsString()
  status: string;    
  // Optional, defaults to 'PENDING'
}
