import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./models";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[SequelizeModule.forFeature([User]),
    ConfigModule.forRoot({
        isGlobal:true
    }),
    JwtModule.register({
        global:true,
        secret:process.env.ACCESS_TOKEN_SECRET,
        signOptions:{
            expiresIn:process.env.ACCESS_TOKEN_TIME ? parseInt(process.env.ACCESS_TOKEN_TIME):'1h '
        }
    })
    ],
    controllers:[UserController],
    providers:[UserService]
})

export class UserModule {}