/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

// import { AppModule } from '@muckidrive/app.module';
// import { LoaderService, LoaderModel } from '@muckidrive/loader';
import { AppModule } from '../../app.module';
import { LoaderService, LoaderModel } from '../../loader';

@Injectable()
export class LoaderGuard implements CanActivate {

    constructor() {}

    /**
     * Guard for to check, if current module is enable.
     * 
     * @param context
     * @returns boolean
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const app = await NestFactory.create(AppModule);
        const loaderService = app.get(LoaderService);

        const classContent: any = context.getClass();

        const module: LoaderModel = await loaderService.findModuleByName(classContent.ruleModule);
        if(module) {

            if(module.isActive) {
                return true;
            }
        }

        return false;
    }
}
