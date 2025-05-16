import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dtos/create.product.dtos";
import { UpdateProductDto } from "./dtos/update.product.dtos";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { ProductQuery } from "./dtos";
import { CheckMimeTypePipe, CheckSizePipe } from "src/pipes";
import { Protected } from "src/decorators/protected.decorator";
import { CheckToken } from "src/guards/check.token.guard";
import { Roles } from "src/decorators/role.decorator";
import { UserRoles } from "../auth";
import { CheckRolesGuard } from "src/guards/check.role.guard";

@UseGuards(CheckToken,CheckRolesGuard)
@Controller('products')
export class ProductController {
    constructor(private service:ProductService){}

    @ApiBearerAuth()
    @Get()
    @Protected(false)
    @Roles([UserRoles.ADMIN,UserRoles.USER])
    async getAll(@Query() queries:ProductQuery){
        return await  this.service.getAll(queries)
    }

    @ApiBearerAuth()
    @Get(':id')
    @Protected(false)
    @Roles([UserRoles.ADMIN,UserRoles.USER])
    async getOne(@Param('id', ParseIntPipe) id:number){
        return await  this.service.getOne(id)
    }

    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('image'))
    @Post()
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    @ApiConsumes('multipart/form-data')
    async createNew(@Body() payload:CreateProductDto,
        @UploadedFile(new CheckMimeTypePipe(['png','jpg']), new CheckSizePipe(1000000*3)) image:Express.Multer.File){
        return await  this.service.createNew(payload,image)
    }

    @ApiBearerAuth()
    @Patch(':id')
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    async updateProduct(@Body() payload:UpdateProductDto,
        @Param('id',ParseIntPipe) id:number){
        return await  this.service.updateProduct(payload,id)
    }

    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('image'))
    @Put(':id')
    @Protected(true)
    @Roles([UserRoles.ADMIN])
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

    @ApiBearerAuth()
    @Delete(':id')
    @Protected(true)
    @Roles([UserRoles.ADMIN])
    async deleteProduct(@Param('id',ParseIntPipe) id:number){
        return await this.service.deleteProduct(id)
    }
}