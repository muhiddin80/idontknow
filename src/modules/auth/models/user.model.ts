import { Column, DataType, Model, Table } from "sequelize-typescript";
import { UserRoles } from "../enum";

@Table({tableName:'users',timestamps:true})
export class User extends Model{
    @Column({type:DataType.TEXT})
    name:string;

    @Column({type:DataType.TEXT})
    email:string;

    @Column({type:DataType.TEXT})
    password:string;

    @Column({type:DataType.ENUM,values:Object.values(UserRoles),defaultValue:UserRoles.USER})
    role:UserRoles;
}