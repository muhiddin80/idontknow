import { Injectable } from "@nestjs/common";
import * as fs from "node:fs"
import * as path from "node:path"
import * as fsPromise from "node:fs/promises"

@Injectable()
export class FsHelpers{
    async uploadFile(file:Express.Multer.File){
        const fileHolder = path.join(process.cwd(), 'uploads')

        if(!fs.existsSync(fileHolder)){
            fs.mkdirSync(fileHolder,{recursive:true})
        }

        let fileName = `${Date.now()}-file.${file.originalname.split('.')[1]}`;

        await fsPromise.writeFile(path.join(fileHolder,fileName),file.buffer)
        return fileName
    }

    async deleteFile(fileName:string){
        const filePath = path.join(process.cwd(),'uploads',fileName);
        if(!fs.existsSync(filePath)){
            return null;
        }

        await fsPromise.unlink(filePath)
        return null
    }
}