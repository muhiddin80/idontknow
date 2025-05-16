import { Type } from "class-transformer";
import { IsEnum, IsIn, IsPositive, IsString } from "class-validator";
import { QuerySortField } from "../enum/query.sortfield.enum";
import { ProductStatus } from "../enum";
import { ApiProperty } from "@nestjs/swagger";

export class ProductQuery {
    @ApiProperty({required:false,example:10})
    @Type(()=>Number)
    @IsPositive()
    limit:number;

    @ApiProperty({required:false,example:1})
    @Type(()=>Number)
    @IsPositive()
    page:number;

    @ApiProperty({required:false,example:'price'})
    @IsString()
    @IsEnum(QuerySortField)
    sortField:QuerySortField;

    @ApiProperty({required:false,example:'ASC'})
    @IsString()
    @IsIn(['ASC','DESC'])
    sortOrder:'ASC'|'DESC';

    @ApiProperty({required:false,example:1000})
    @Type(()=>Number)
    @IsPositive()
    maxPrice:number;

    @ApiProperty({required:false,example:100})
    @Type(()=>Number)
    @IsPositive()
    minPrice:number;

    @ApiProperty({
        type:'string',
        enum:ProductStatus,
        required:false
    })
    @IsEnum(ProductStatus)
    status:ProductStatus
};