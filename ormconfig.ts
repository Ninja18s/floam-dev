import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import 'dotenv/config'
import { UserEventSubscriber } from './src/users/userEvent.subscriber'

interface ENV {
  NODE_ENV: string
  DB_PORT: number
  DB_HOST: string
  DB_USERNAME: string
  DB_PASSWORD: string
  DB_NAME: string
}

declare const process: {
  env: ENV,
}

// console.log(process.env)
// console.log('\n\n\n')
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, NODE_ENV } = process.env
console.log(`****** application node is ${NODE_ENV}`)

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: 5432,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [
    'dist/**/*.entity.js',
  ],
  synchronize: false,
  migrations: ['dist/migration/*.js'],
  migrationsRun: true,
  namingStrategy: new SnakeNamingStrategy(),
  cli: {
    migrationsDir: 'migration',
  },
  ssl: false,
  subscribers: [
    UserEventSubscriber,
  ],
  // logging: 'all',
}

export = config
