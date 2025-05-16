import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "./models";
import { FsHelpers } from "src/helpers/fs.helper";

@Module({
    imports:[SequelizeModule.forFeature([Product])],
    controllers:[ProductController],
    providers:[ProductService,FsHelpers]
})

export class ProductModule {};