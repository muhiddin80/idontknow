import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models";
import { RegisterDtos } from "./dtos/register.dtos";
import * as bcrypt from "bcryptjs"
import { where } from "sequelize";
import { LoginDtos } from "./dtos";

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private UserModel:typeof User){}

    async Register(payload:RegisterDtos){
        const founded = await this.UserModel.findOne({where:{email:payload.email}})
        if(founded?.dataValues){
            throw new BadRequestException('User with this email is already exist!')
        }
        let passwordHash = bcrypt.hashSync(payload.password)
        let newUser = await this.UserModel.create({
            name:payload.name,
            email:payload.email,
            password:passwordHash
        })
        return {
            message:"Successfully registered!",
            data:newUser
        }
    }

    async Login(payload:LoginDtos){
        const founded = await this.UserModel.findOne({where:{email:payload.email}})
        if(!founded?.dataValues){
            throw new BadRequestException('User with this email does not exist!');
        }

        let isMatch = bcrypt.compare(payload.password,founded.dataValues.password);
        if(!isMatch){
            throw new BadRequestException("Invalid password!")
        }
        return {
            message:"Successfully logged!"
        }
    }
}