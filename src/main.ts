import { NestFactory } from '@nestjs/core'
import { WinstonModule } from 'nest-winston'
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities'
import * as winston from 'winston'
import { AppModule } from './app/app.module'
import * as Express from 'express'
import { ExpressAdapter } from '@nestjs/platform-express'
import 'dotenv/config'

const server = Express()
server.get('/_ah/health', (req, res) => res.send('ok'))

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
    {
      logger: WinstonModule.createLogger({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              nestWinstonModuleUtilities.format.nestLike(),
            ),
          }),
        ],
      })
    })
  // todo: add logic to only accept specific headers
  app.enableCors()
  await app.listen(process.env.PORT)
  console.log(`dev started on localhost:${process.env.PORT}`)
}
bootstrap();
