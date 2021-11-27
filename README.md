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
$ nest start
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

db:
  type: 'mysql'
  url: 'localhost'
  port: 3306
  database: 'mydatabase'
  username: 'database_user'
  password: 'database_password'
  entityPrefix: 'random_prefix_'
  logging: false

grapgql:
  debug: false
  playground: true
  schemaPath: './var/etc/schema.gql'

auth:
  backend:
    jwt:
      secret: 'my_random_jwt_secret_key'
      signOptions:
        expiresIn: '20s' #Eg: 60, "2 days", "10h", "7d"
```

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
