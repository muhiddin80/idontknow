import { IsEnum, IsPositive, IsString } from "class-validator";
import { ProductStatus } from "../enum";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty({required:true,example:'computer'})
    @IsString()
    name:string;

    @ApiProperty({required:true,example:'Juda zor'})
    @IsString()
    description:string;

    @ApiProperty({required:true,example:700})
    @Type(()=>Number)
    @IsPositive()
    price:number;

    @ApiProperty({required:false,default:0})
    @Type(()=>Number)
    @IsPositive()
    discount:number;

    @ApiProperty({required:false,maximum:5})
    @Type(()=>Number)
    @IsPositive()
    rating:number;

    @ApiProperty({required:false,example:100})
    @Type(()=>Number)
    @IsPositive()
    stock:number;

    @ApiProperty({enum:ProductStatus,required:false})
    @IsEnum(ProductStatus)
    status:ProductStatus;

    @ApiProperty({type:'string',format:'binary',required:false})
    image:Express.Multer.File;
}