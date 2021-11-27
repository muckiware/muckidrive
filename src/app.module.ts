/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Module, Global, CacheModule, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { DatabaseModule } from './database.module'
import configuration from './config/configuration';
import { BasicsModule } from './basics/basics.module';
import { GraphQLApiModule } from './graphql/graphql.module';
import { HelperPathTools } from './helper';
import { ModuleConfigService } from './config';

import { 
    LoaderModel,
    ConfigModel,
    LoaderService
} from './loader';

import { LoaderModule } from './loader/loader.module';

import { InitModule } from './init';
import { AuthenticationBackendModule } from './authentication/backend/authentication.module';
import { AuthorizationBackendModule } from './authorization/backend/authorization.module';
import { LoggerService, LoggerModule } from './logging';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration]
        }),
        DatabaseModule.registerDatabaseModuleAsync(),
        BasicsModule,
        LoggerModule,
        GraphQLApiModule,
        AuthenticationBackendModule,
        AuthorizationBackendModule,
        forwardRef(() => 
            TypeOrmModule.forFeature([LoaderModel, ConfigModel])
        ),
        LoaderModule.loadModules(),
        InitModule,
        CacheModule.register(),
        EventEmitterModule.forRoot({
            wildcard: false,
            delimiter: '.',
            newListener: false,
            removeListener: false,
            maxListeners: 30,
            verboseMemoryLeak: false,
            ignoreErrors: false,
        })
    ],
    controllers: [],
    providers: [
        LoaderService,
        HelperPathTools,
        LoggerService,
        ModuleConfigService
    ],
    exports: [
        ConfigModule,
        DatabaseModule,
        BasicsModule,
        LoggerModule,
        GraphQLApiModule,
        LoaderService,
        HelperPathTools,
        LoggerService,
        ModuleConfigService
    ]
})
export class AppModule {}
