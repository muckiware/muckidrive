/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Module, OnModuleInit } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService} from '@nestjs/config';

import * as path from 'path';
import { HelperFileTools } from '@muckidrive/helper';

@Module({
    imports: [
        GraphQLModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                debug: configService.get<boolean>('grapgql.debug'),
                playground: configService.get<boolean>('grapgql.playground'),
                installSubscriptionHandlers: true,
                autoSchemaFile: configService.get<string>('grapgql.schemaPath')
            }),
            
        })
    ],
})
export class GraphQLApiModule implements OnModuleInit {

    async onModuleInit() {

        HelperFileTools.saveObjectInFile(
            path.normalize(path.join(process.cwd(), 'var/etc/module.json')),
            {
                name: 'GraphQLApiModule',
                description: 'Module for to create API with GraphQL interface',
                moduleVersion: '1.0.0',
                vendor: 'muckware',
                license: 'MIT'
            }
        );
    }
}
