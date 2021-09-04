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

import { DatabaseModule } from './database.module'
import configuration from './config/configuration';
import { BasicsModule } from './basics/basics.module';
import { GraphQLApiModule } from './graphql/graphql.module';
import { HelperPathTools } from './helper';
import { ModuleConfigService } from './config';

import { 
    LoaderModel,
    ConfigModel,
    LoaderService,
    LoaderResolver
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
        CacheModule.register()
    ],
    controllers: [],
    providers: [
        LoaderService,
        LoaderResolver,
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
        LoaderResolver,
        HelperPathTools,
        LoggerService,
        ModuleConfigService
    ]
})
export class AppModule {}
