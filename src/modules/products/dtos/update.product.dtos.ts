import { IsEnum, IsOptional, IsPositive, IsString } from "class-validator";
import { ProductStatus } from "../enum";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductDto {
    @ApiProperty({required:false,example:'computer'})
    @IsOptional()
    @IsString()
    name:string;
    
    @ApiProperty({required:false,example:'Juda zor'})
    @IsOptional()
    @IsString()
    description:string;

    @ApiProperty({required:false,example:700})
    @IsOptional()
    @Type(()=>Number)
    @IsPositive()
    price:number;

    @ApiProperty({required:false,default:0})
    @IsOptional()
    @Type(()=>Number)
    @IsPositive()
    discount:number;

    @ApiProperty({required:false,maximum:5})
    @IsOptional()
    @Type(()=>Number)
    @IsPositive()
    rating:number;

    @ApiProperty({required:false,example:100})
    @Type(()=>Number)
    @IsOptional()
    @IsPositive()
    stock:number;

    @ApiProperty({enum:ProductStatus})
    @IsOptional()
    @IsEnum(ProductStatus)
    status:ProductStatus;
}