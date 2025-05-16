import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDtos{
    @ApiProperty({required:true,example:'Example'})
    @IsString()
    name:string;

    @ApiProperty({required:true,example:'example@gmail.com'})
    @IsEmail()
    email:string;

    @ApiProperty({required:true,example:'example'})
    @MaxLength(12)
    @MinLength(4)
    @IsString()
    password:string;
}