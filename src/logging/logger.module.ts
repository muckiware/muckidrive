/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Module, OnModuleInit, Global } from '@nestjs/common';

import * as path from 'path';
// import { HelperFileTools } from '@muckidrive/helper';
import { HelperFileTools } from '../helper';

@Global()
@Module({
    imports: [],
    providers: [],
    exports: []
})
export class LoggerModule implements OnModuleInit {

    async onModuleInit() {

        HelperFileTools.saveObjectInFile(
            path.normalize(path.join(process.cwd(), 'var/etc/module.json')),
            {
                name: 'LoggerModule',
                description: 'Module for to log programming items',
                moduleVersion: '1.0.0',
                vendor: 'muckware',
                license: 'MIT'
            }
        );
    }
}
