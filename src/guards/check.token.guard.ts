import { BadRequestException, CanActivate, ConflictException, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JsonWebTokenError, JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ForeignKey } from "sequelize-typescript";
import { PROTECTED_KEY } from "src/decorators/protected.decorator";
import { UserRoles } from "src/modules/auth";

@Injectable()
export class CheckToken implements CanActivate{
    constructor(private reflector:Reflector,
            private JwtService:JwtService
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isProtected = this.reflector.getAllAndOverride<boolean>(PROTECTED_KEY,[
            context.getHandler(),
            context.getClass()
        ])

        const ctx  = context.switchToHttp()
        const request = ctx.getRequest<Request & {role?:string,userId?:string}>()

        if(!isProtected){
            request.role=UserRoles.USER;
            return true
        }

        const token = request.headers['authorization'];

        if(!token|| !token.startsWith('Bearer')){
            throw new BadRequestException('Please enter your token!')
        }

        const accessToken = token.split('Bearer')[1].trim()

        if(!accessToken){
            throw new BadRequestException('Please enter your accesstoken!')
        }

        try {
            const data = this.JwtService.verify(accessToken)
            request.userId = data?.id
            request.role=data?.role;

            return true
        } catch (error) {
            if(error instanceof TokenExpiredError){
                throw new ForbiddenException("Your token expired!")
            }
            if(error instanceof JsonWebTokenError){
                throw new ConflictException('Invalid token!')
            }

            throw new InternalServerErrorException('Interval server error!')
        }
    }
}