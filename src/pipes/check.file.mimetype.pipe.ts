import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class CheckMimeTypePipe implements PipeTransform{
    mimeType:string[]
    constructor(mimeType:string[]){
        this.mimeType=mimeType
    }

    transform(value: any, metadata: ArgumentMetadata) {
        if(!value) return value;
        if(!this.mimeType.includes(value.originalname.split('.').at(-1) as string)){
            throw new BadRequestException("We can't read this type of files!")
        }
        return value;
    }
}