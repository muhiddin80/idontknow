import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dtos/create.product.dtos";
import { UpdateProductDto } from "./dtos/update.product.dtos";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { ProductQuery } from "./dtos";
import { CheckMimeTypePipe, CheckSizePipe } from "src/pipes";

@Controller('products')
export class ProductController {
    constructor(private service:ProductService){}

    @Get()
    async getAll(@Query() queries:ProductQuery){
        return await  this.service.getAll(queries)
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id:number){
        return await  this.service.getOne(id)
    }

    @UseInterceptors(FileInterceptor('image'))
    @Post()
    @ApiConsumes('multipart/form-data')
    async createNew(@Body() payload:CreateProductDto,
        @UploadedFile(new CheckMimeTypePipe(['png','jpg']), new CheckSizePipe(1000000*3)) image:Express.Multer.File){
        return await  this.service.createNew(payload,image)
    }

    @Patch(':id')
    async updateProduct(@Body() payload:UpdateProductDto,
        @Param('id',ParseIntPipe) id:number){
        return await  this.service.updateProduct(payload,id)
    }

    @UseInterceptors(FileInterceptor('image'))
    @Put(':id')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            image: {
              type: 'string',
              format: 'binary'
            }
          }
        }
      })
    @ApiConsumes('multipart/form-data')
    async updateimage(@UploadedFile(new CheckMimeTypePipe(['png','jpg']), new CheckSizePipe(1000000*3)) image:Express.Multer.File,
            @Param('id',ParseIntPipe) id:number){
                return await this.service.updateImage(image,id)
            }

    @Delete(':id')
    async deleteProduct(@Param('id',ParseIntPipe) id:number){
        return await this.service.deleteProduct(id)
    }
}