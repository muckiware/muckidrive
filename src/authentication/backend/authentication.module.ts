/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Module, Global, OnModuleInit } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import * as path from 'path';
import { HelperFileTools } from '@muckidrive/helper';
import {
    LocalStrategy,
    JwtStrategy,
    AuthBackendResolver,
    AuthenticationService
} from './index';

@Global()
@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => {
              return {
                secret: configService.get<string>('auth.backend.jwt.secret'),
                signOptions: {
                    expiresIn: configService.get<string | number>('auth.backend.jwt.signOptions.expiresIn')
                },
              };
            },
            inject: [ConfigService],
            imports: [ConfigModule]
        }),
    ],
    providers: [
        AuthenticationService,
        LocalStrategy,
        JwtStrategy,
        AuthBackendResolver
    ]
})

export class AuthenticationBackendModule implements OnModuleInit {

    async onModuleInit() {

        HelperFileTools.saveObjectInFile(
            path.normalize(path.join(process.cwd(), 'var/etc/module.json')),
            {
                name: 'AuthenticationBackendModule',
                description: 'Module for to authenticte backend users',
                moduleVersion: '1.0.0',
                vendor: 'muckware',
                license: 'MIT'
            }
        );
    }
}
