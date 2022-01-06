# Backend monolith service for floam.co
![floam logo](https://floam-resources.s3.us-east-2.amazonaws.com/floam-logo.png)

## Framework and services used
- [nest.js](https://nestjs.com/) framework for building scalable server-side applications
- [typeorm](https://typeorm.io/#/) for database object relation mapping
- [postgresql](https://www.postgresql.org/) database layer

## Local environment setup (mac os)
- install [node](https://nodejs.org/en/download/)
- install [homebrew](https://brew.sh/)
- install yarn <br/> `brew install yarn`
- install postgreSQL <br/> `brew install postgresql`
- setup local database <br/>
    - log into postgres console <br/> `psql postgres`
    - create database <br/> `create database floam;`
    - create default user <br/> `create user floam_user with encrypted password 'floam123';`
    - grant access to user <br/> `grant all privileges on database floam to floam_user;`
    - switch to floam db <br/> `\c floam;`
    - add uuid extension <br/> `CREATE EXTENSION IF NOT EXISTS "uuid-ossp”;`
- in project root, create `.env` file, copy content from `env.template` to your env file
- start server 
    - `yarn start:dev`
    - this builds the project, runs new migrations and starts the local server
    - navigate to `http://localhost:3000`

## Migrations
When you modify entities, you can generate a new migration by running <br/>
`yarn migrate:gen -n [name_of_migration_as_snake_patter]`  <br/>
Typeorm will generate a migration based on the difference between your entities and the table/columns in floam db.

## Available commands
- `yarn build` cleans dist directory and builds the project
- `yarn start` starts the application from the dist directory
- `yarn start:dev` starts the application and setup watcher for file changes
- `yarn migrate:gen` generate a new migration file
- `yarn migrate:create` generate an empty migration file
- `yarn migrate:run` runs new migration files
- `yarn migrate:revert` reverts the last migration which was executed

## Folder and file structure
- modules/features: are grouped by business domain. 
- *.entity.ts: entity files used by typeorm. This has a one-to-one mapping to a table in floam db.
- *.controller.ts: entry point into the business domain.
- *.service.ts: service layer.
- [*.module.js](https://docs.nestjs.com/modules): used by nest.js to organize the app. 
