/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Module, Global, forwardRef } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database.module'
import configuration from './config/configuration';
import { BasicsModule } from './basics/basics.module';
import { HelperPathTools } from './helper';

import { 
    LoaderModule,
    LoaderModel,
    LoaderService,
    LoaderResolver
} from './loader';
import { InitModule } from './init';
import { AuthenticationBackendModule } from './authentication/backend/authentication.module';
import { AuthorizationBackendModule } from './authorization/backend/authorization.module';

const loaderInstance = LoaderModule.getInstance();

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration]
        }),
        DatabaseModule.registerDatabaseModuleAsync(),
        BasicsModule,
        // TODO / To Check orwardRef(() => CoreModule),
        AuthenticationBackendModule,
        AuthorizationBackendModule,
        TypeOrmModule.forFeature([LoaderModel]),
        loaderInstance.registerModules(),
        InitModule
    ],
    controllers: [],
    providers: [
        LoaderService,
        LoaderResolver,
        HelperPathTools
    ],
    exports: [
        ConfigModule,
        DatabaseModule,
        BasicsModule,
        LoaderService,
        LoaderResolver,
        HelperPathTools
    ]
})
export class AppModule {}
