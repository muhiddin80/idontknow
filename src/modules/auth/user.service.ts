import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models";
import { RegisterDtos } from "./dtos/register.dtos";
import * as bcrypt from "bcryptjs"
import { where } from "sequelize";
import { LoginDtos } from "./dtos";
import { JwtService } from "@nestjs/jwt";
import { UserRoles } from "./enum";

@Injectable()
export class UserService implements OnModuleInit{
    constructor(@InjectModel(User) private UserModel:typeof User,
                private JwtService:JwtService){}

    async onModuleInit() {
        await this.seedUsers()
    }

    async Register(payload:RegisterDtos){
        const founded = await this.UserModel.findOne({where:{email:payload.email}})
        if(founded?.dataValues){
            throw new BadRequestException('User with this email is already exist!')
        }
        let passwordHash =  bcrypt.hashSync(payload.password)
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

        let isMatch = await bcrypt.compare(payload.password,founded.dataValues.password);
        if(!isMatch){
            throw new BadRequestException("Invalid password!")
        }

        const token = await this.JwtService.signAsync({id:founded.dataValues.id,role:founded.dataValues.role})
        return {
            token,
            message:"Successfully logged!"
        }
    }

    async seedUsers() {
        const defaultUsers = [
          {
            name: 'example',
            age: 25,
            email: 'example@gmail.com',
            password: 'example',
            role: UserRoles.ADMIN,
          },
        ];
    
        for (let user of defaultUsers) {
          const foundedUser = await this.UserModel.findOne({
            where: { email: user.email },
          });
    
          if (!foundedUser) {
            const passHash = bcrypt.hashSync(user.password);
            await this.UserModel.create({
              name: user.name,
              role: user.role,
              age: user.age,
              email: user.email,
              password: passHash,
            });
          }
        }
        console.log("Example admini created")
    }
}