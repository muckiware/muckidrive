![muckidrive logo](https://raw.githubusercontent.com/muckiware/muckidrive/main/var/logo_256x256.png)
# Description

[muckiDrive](https://github.com/muckiware/muckidrive) server system repository. A basic foundation for to build headless server applications with GraphQL interface connection. 

## Features
- [nest.js](https://nestjs.com) basic and module structures
- [typeORM](https://typeorm.io) integration for database actions
- [GraphQL](https://graphql.org) data interface integration
- Logging integration
- System user and ACL managment
- JWT authentification
- Autommatic custom module loader for own extensions

# Installation

```bash
$ npm install
```

# Running the server

```bash
# start server application
$ npm start
```

# Testing the server

```bash
# Testing server application with Jest framework
$ npm run test
```

## Configuration
```YAML
# etc/config.yml
http:
  host: '127.0.0.1'
  port: 3000
  masterAppPath: 'admin'

db:
  type: 'mysql'
  url: 'localhost'
  port: 3306
  database: 'mydatabase'
  username: 'database_user'
  password: 'database_password'
  entityPrefix: 'random_prefix_'
  logging: false

graphql:
  debug: false
  playground: true
  schemaPath: './var/etc/schema.gql'

auth:
  backend:
    jwt:
      secret: 'my_random_jwt_secret_key'
      signOptions:
        expiresIn: '20s' #eg: 60, "2 days", "10h", "7d"
```

| Key | Description | Example | Data Type |
| :---| :--- | :--- |:--- |
| http.host | host of system, on which the application is runing | 127.0.0.1 | string |
| http.port | Port on which the server application should be running | 8082 | integer |
| http.masterAppPath | Path on which the server administration should be running | admin | string |
| db.type | The type of database instance. Usually should that be MySQL/MariaDB | mysql | string |
| db.url | Connection address of the database instance. | localhost | string|
| db.port | Port connection of the database instance. | 3306 | integer |
| db.database | Name of the database instance. | myserverapplication | string |
| db.username | User name of the database to get access to the tables. | mysqluser | string |
| db.password | User password of the database to get access to the tables. | Random string | string |
| db.entityPrefix | Can be use to add to all database table names a prefix like this: prefix_mytable. | prefix_ | string |
| db.logging | Can be use to get debugging outputs of the database. | false | boolean |
| graphql.debug | Can be use to get debugging outputs of the graphql API output. | false | boolean |
| graphql.playground | Enables the playground for to testing the graphql API | false | boolean |
| graphql.schemaPath | Relative path in local file system for to save the GraphQL definition file | ./var/etc/schema.gql | string |
| auth.backend.jwt.secret | Key which will be used by creating user tokens as signatur | Random string | string |
| auth.backend.jwt.signOptions.expiresIn | Time how long the user tokens after login actions should be valid | 1h | string |
# Usage
## Module configurations
Each module can save and can unlimit key/value pairs. It will saved in a database table and served of a cached storage.
```JAVASCRIPT
import { Injectable } from '@nestjs/common';
import { ModuleConfigService } from '@muckidrive/config';

import { MyCustomModule } from 'my.custom.module.ts';

@Injectable()
export class MyCustomService  {

  constructor(
    ...
    private readonly moduleConfigService: ModuleConfigService
    ...
  ) { }

  public myExampleGetConfg() {

    return this.moduleConfigService.getValueByKey(MyCustomModule.name, 'key', 'defaultValue');
  }
}
```

The value can be typed with string, number, float or boolean. 
## Events
muckiDrive offers you various events for application actions

### Overview
| Event | Trigger Ident | Description |
| :--- | :---- | :--- |
| Create new loader module | loader.create.before | Triggers Event before for to creates a new module |
| Create new loader module | loader.create.after | Triggers Event after for to creates a new module |
| Update loader module | loader.update.before | Triggers Event before for to updates a existing module |
| Update loader module | loader.update.after | Triggers Event after for to updates a existing module |
| Remove loader module | loader.remove.before | Triggers Event before for to remove a existing module |
| Remove loader module | loader.remove.after | Triggers Event after for to remove a existing module |

### Subscribe
The example shows, how you can subscribe an event in your class.
```JAVASCRIPT
import { OnEvent } from '@nestjs/event-emitter';

export class MyCreatedListener {

    @OnEvent('loader.create.after')
    handleLoaderCreatedEvent(event: LoaderCreateEvent) {
        //Do something with event object
    }
}
```
## loggings
For to create logging items in your modules, offers muckidrive an logging service as interface. This service creates logging files into the subfolder var/log. It will use log rotation by configure the maximun number of files and file size of earch log. 

First config the logger service interface in your module setup.
```JAVASCRIPT
import { Module } from '@nestjs/common';

import { MyExampleService } from './services';
import { LoggerService } from '@muckidrive/logging';

@Module({
    imports: [
        ...
    ],
    providers: [ 
        MyExampleService,
        ...
        {
            provide: 'LoggerServiceInterface',
            useClass: LoggerService
        }
    ],
    exports: [
      ...
    ]
})

export class MyExampleModule {}
```

With this setup you can inject the logger service interface in your own service
```JAVASCRIPT
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';

import { LoggerServiceInterface } from '@muckidrive/logging';
import { MyModel } from '../models';

@Injectable()
export class MyExampleService {

  constructor(
    ...
    @InjectRepository(SomeModel)
    private readonly myModelRepository: Repository<SomeModel>,
    @Inject('LoggerServiceInterface')
    private readonly loggerService: LoggerServiceInterface
    ...
  ) {}

  async create(userId: number): Promise<SomeModel> {

    const myModel = new SomeModel();
    myModel.userId = userId;
    myModel.createDateTime = new Date(DateTime.utc().toString());

    this.loggerService.debug('create user by id' + userId, 'acme', 'mymodule');
    await this.myModelRepository
      .save(myModel)
      .catch(error => {
        this.loggerService.error(error, 'acme', 'mymodule');
      });
}
```
The logger service offers these several log levels
```JAVASCRIPT
this.loggerService.trace(message: string, loggerContext?: string, extensionContext?: string);
this.loggerService.debug(message: string, loggerContext?: string, extensionContext?: string);
this.loggerService.info(message: string, loggerContext?: string, extensionContext?: string);
this.loggerService.warn(message: string, loggerContext?: string, extensionContext?: string);
this.loggerService.error(message: string, loggerContext?: string, extensionContext?: string);
this.loggerService.fatal(message: string, loggerContext?: string, extensionContext?: string);
```

## Filter Input Example
```JAVASCRIPT
filter: [
  {
    filterDefinition: [{
      term: "logger"
      operator: LIKE
      field: "name"
    },
    {
      term: "0"
      operator: EQ
      field: "isActive"
    }]
  },
  {
    filterDefinition: [{
      term: "admin"
      operator: LIKE
      field: "name"
    }]
  }
]
```

## Pagination Input Example
```JAVASCRIPT
pagination: {
  orderField: "name"
  perPage: 30
  pageNumber: 2
}
```

## License
muckiDrive server is [MIT licensed](LICENSE).
