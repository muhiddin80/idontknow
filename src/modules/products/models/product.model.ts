import { Table, Model, Column, DataType } from "sequelize-typescript";
import { ProductStatus } from "../enum";

@Table({tableName:'products',timestamps:true})
export class Product extends Model{
    @Column({type:DataType.TEXT})
    name:string;

    @Column({type:DataType.TEXT})
    description:string;

    @Column({type:DataType.SMALLINT})
    price:number;

    @Column({type:DataType.SMALLINT})
    discount:number;

    @Column({type:DataType.SMALLINT})
    rating:number;

    @Column({type:DataType.BIGINT})
    stock:number;

    @Column({type:DataType.ENUM,values:Object.values(ProductStatus),defaultValue:ProductStatus.active})
    status:ProductStatus;

    @Column({type:DataType.TEXT})
    image_url:string;
}