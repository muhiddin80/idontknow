import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters';
import { NotAcceptableException, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.useGlobalFilters(new HttpExceptionFilter())
  const config = new DocumentBuilder()
    .setTitle('Exam')
    .setDescription('Api CRUD for products model')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('docs',app,documentFactory)

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion:'1',
    prefix:'v-'
  })
  
  app.enableCors({
    allowedHeaders:['authorization'],
    methods:['GET','POST','PUT','PATCH','DELETE'],
    optionSuccessStatus:200,
    origin:(reqOrigin,cd)=>{
      const allowedOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      :'*';

    if(allowedOrigins.includes(reqOrigin)||allowedOrigins.includes('*'))
      return cd(null);
    else
      cd(
          new NotAcceptableException(
            `Sending request to ${reqOrigin} is forbidden!`
          ),
      );
    },
  });
  const Port = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000;
  await app.listen(Port,()=>{
    console.log(`http://localhost:${Port}/api -> Server uchun`)
    console.log(`http://localhost:${Port}/docs -> Swagger uchun`)
  })
}
bootstrap();
