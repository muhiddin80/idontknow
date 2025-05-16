import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Product } from "./models";
import { CreateProductDto } from "./dtos/create.product.dtos";
import { UpdateProductDto } from "./dtos/update.product.dtos";
import { FsHelpers } from "src/helpers/fs.helper";
import { ProductQuery } from "./dtos";
import { Op } from "sequelize";

@Injectable()
export class ProductService{
    constructor(@InjectModel(Product) private productModel: typeof Product,
            private fs:FsHelpers){
    }

    async getAll(queries:ProductQuery){
        let filter:any = {}; 
        if(queries.maxPrice){
            filter.price={
                [Op.lte]:queries.maxPrice
            }
        }
        if(queries.minPrice){
            filter.price={
                ...filter.price,
                [Op.gte]:queries.minPrice
            }
        }
        if(queries.status){
            filter.status ={
                [Op.eq]:queries.status
            }
        }

        const products = await this.productModel.findAll({
            limit:queries.limit||10,
            offset:(queries.page-1)*queries.limit||0,
            order:queries.sortField? [[queries.sortField,queries.sortOrder||"DESC"]] :[['id','ASC']],
            where:{...filter}
        })
        return {
            message:"Success!",
            data:products,
            limit:queries.limit,
            page:queries.page
        }
    }

    async getOne(id:number){
        const founded = await this.productModel.findOne({where:{id:id}})
        if(!founded?.dataValues){
            throw new BadRequestException('This product is not exist!')
        }
        return {
            message:"Success!",
            data:founded.dataValues
        }
    }

    async createNew(payload:CreateProductDto,image:Express.Multer.File){
        const founded = await this.productModel.findOne({where:{name:payload.name}})
        if(founded?.dataValues){
            throw new BadRequestException('This product is already exist!')
        }

        let imageName:string =''
        if(image){
            imageName = await this.fs.uploadFile(image)
        }
        await this.productModel.create({
            name:payload.name,
            price:payload.price,
            description:payload.description,
            discount:payload.discount,
            rating:payload.rating,
            stock:payload.stock,
            status:payload.status,
            image_url:imageName
        })

        return {
            message:"Successfully created!",
            data:payload
        }
    }

    async updateProduct(payload:UpdateProductDto,id:number){
        const founded = await this.productModel.findOne({where:{name:payload.name}})
        if(!founded?.dataValues){
            throw new BadRequestException('This product is not exist!')
        }
        await this.productModel.update({
            name:payload.name|| founded.dataValues.name,
            price:payload.price || founded.dataValues.price,
            description:payload.description || founded.dataValues.describtion,
            discount:payload.discount || founded.dataValues.discount,
            rating:payload.rating || founded.dataValues.rating,
            stock:payload.stock || founded.dataValues.stock,
            status:payload.status || founded.dataValues.status,
        },{where:{id:id}});

        return {
            message:"Successfully updated!"
        }
    }

    async updateImage(image:Express.Multer.File,id:number){
        const founded = await this.productModel.findOne({where:{id:id}})
        if(!founded?.dataValues){
            throw new BadRequestException('This product is not exist!')
        }
        await this.fs.deleteFile(founded.dataValues.image_url)

        let imageName:string =''
        if(image){
            imageName = await this.fs.uploadFile(image)
        }

        await this.productModel.update({
            image_url:imageName
        },{where:{id:id}})

        return {
            message:"Successfully updated!"
        }
    }

    async deleteProduct(id:number){
        const founded = await this.productModel.findOne({where:{id:id}})
        if(!founded?.dataValues){
            throw new BadRequestException('This product is not exist!')
        }
        await this.fs.deleteFile(founded.dataValues.image_url)

        await this.productModel.destroy({where:{id:id}})
        return {
            message:"Successfully deleted!"
        }
    }
}