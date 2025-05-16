import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class CheckSizePipe implements PipeTransform{
    size:number
    constructor(size:number){
        this.size=size
    }

    transform(value: any, metadata: ArgumentMetadata) {
        if(!value) return value;
        if(this.size>value.size){
            throw new BadRequestException("Send file smaller images!")
        }
        return value;
    }
}