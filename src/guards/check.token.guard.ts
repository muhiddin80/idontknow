import { CanActivate, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class CheckToken implements CanActivate{
    constructor(private reflector:Reflector,
        p
    ){}
}