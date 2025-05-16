import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './modules/auth';
import { ProductModule } from './modules/products/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from "node:path"

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
    }),
    ServeStaticModule.forRoot({
      rootPath:path.join(process.cwd(),'uploads'),
      serveRoot:'/uploads'
    }),
    SequelizeModule.forRoot({
      dialect:'postgres',
      host:process.env.DB_HOST,
      port:process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      password:process.env.DB_PASSWORD,
      username:process.env.DB_USER,
      database:process.env.DB_NAME,
      synchronize:true,
      autoLoadModels:true
    }),
  UserModule,ProductModule],
})
export class AppModule {}
