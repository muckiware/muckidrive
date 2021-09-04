/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Module, Global, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as path from 'path';
// import { HelperFileTools } from '@muckidrive/helper';
import { HelperFileTools } from '../../helper';
import {
    AuthorizationBackendResolver,
    AuthorizationBackendService,
    AuthorizationRulesBackendModel,
    AuthorizationUserRuleBackendModel
} from './index';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            AuthorizationRulesBackendModel,
            AuthorizationUserRuleBackendModel
        ])
    ],
    providers: [
        AuthorizationBackendService,
        AuthorizationBackendResolver
    ],
    exports: [
        AuthorizationBackendService
    ]
})

export class AuthorizationBackendModule implements OnModuleInit {

    onModuleInit() {

        HelperFileTools.saveObjectInFile(
            path.normalize(path.join(process.cwd(), 'var/etc/module.json')),
            {
                name: 'AuthorizationBackendModule',
                description: 'Module for to authorization backend users by rules',
                moduleVersion: '1.0.0',
                vendor: 'muckiware',
                license: 'MIT'
            }
        );
    }
}
