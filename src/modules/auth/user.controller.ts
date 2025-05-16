import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginDtos, RegisterDtos } from "./dtos";

@Controller('auth')
export class UserController {
    constructor(private service:UserService){}

    @Post('regter')
    async Register(@Body() payload:RegisterDtos){
        return this.service.Register(payload)
    }

    @Post('login')
    async Login(@Body() payload:LoginDtos){
        return this.service.Login(payload)
    }
}