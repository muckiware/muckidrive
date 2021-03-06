/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Module, Global, Logger, OnModuleInit, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as path from 'path';

import {
    Stores,
    StoresTranslation,
    LanguagesModel,
    LanguagesService,
    UsersModel,
    UsersService,
    BasicsService,
    BasicServicePagination,
    DatabaseService,
    DefaultEntityFilter
} from './index';

// import { HelperFileTools } from '@muckidrive/helper';
import { HelperFileTools } from '../helper';

@Global()
@Module({
    imports: [
        forwardRef(() => 
            TypeOrmModule.forFeature([
                Stores,
                StoresTranslation,
                LanguagesModel,
                UsersModel
            ])
        )
    ],
    providers: [ 
        LanguagesService,
        UsersService,
        BasicsService,
        BasicServicePagination,
        DatabaseService,
        DefaultEntityFilter
    ],
    controllers: [],
    exports: [
        LanguagesService,
        UsersService,
        BasicsService,
        BasicServicePagination,
        DatabaseService,
        DefaultEntityFilter
    ]
})
export class BasicsModule implements OnModuleInit {

    onModuleInit() {

        let packageContent = HelperFileTools.getObjectByFile(
            path.normalize(path.join(process.cwd(), 'package.json'))
        );

        HelperFileTools.saveObjectInFile(
            path.normalize(path.join(process.cwd(), 'var/etc/module.json')),
            {
                name: 'BasicsModule',
                description: packageContent.description,
                moduleVersion: packageContent.version,
                vendor: packageContent.author,
                license: packageContent.license,
                keywords: packageContent.keywords,
                homepage: packageContent.homepage
            }
        );
    }
}
