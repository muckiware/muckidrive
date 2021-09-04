/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { DynamicModule, Logger, Module } from '@nestjs/common';

import * as path from 'path';

import { SmoppitSalesModule } from './index';
import { HelperFileTools } from '../helper'

export const MODULE_PATH = path.normalize(path.join(process.cwd(), 'dist/app_modules'));
export const MODULE_LIST = path.normalize(path.join(process.cwd(), 'var/etc/module.json'));

@Module({})
export class LoaderModule {

    private static _modulesArray: SmoppitSalesModule[];

    public static async loadModules(): Promise<DynamicModule> {

        this._modulesArray = []

        Logger.log(`Loading modules from ${MODULE_PATH}`, 'LoaderModule');
  
        const loadedModules: Array<Promise<DynamicModule>> = new Array();
        HelperFileTools.findFilesByExtension(MODULE_PATH, 'module.js').forEach(filePath => {

            Logger.log(`load module file ${filePath}`, 'LoaderModule');
            loadedModules.push(
                this._loadModule(filePath).then(module => (module as DynamicModule)),
            );
        });
  
        return Promise.all(loadedModules).then((modules: DynamicModule[]) => {

            if (modules.length > 0) {

                Logger.log(`Found '${modules.length}' modules`, 'LoaderModule');
                modules.forEach(async(module: DynamicModule) => {

                    const moduleName = Object.keys(module).find(key => key.indexOf('Module'));
                    
                    if (moduleName) {

                        const moduleVersion = module[moduleName].moduleVersion
                        const moduleVendor = module[moduleName].vendor
                        const moduleDescription = module[moduleName].description
                        const moduleLicense = module[moduleName].license
                        const moduleKeywords = module[moduleName].keywords
                        const moduleHomepage = module[moduleName].homepage

                        this._modulesArray.push({
                            name: moduleName,
                            description: moduleDescription,
                            moduleVersion: moduleVersion,
                            vendor: moduleVendor,
                            license: moduleLicense,
                            keywords: moduleKeywords,
                            homepage: moduleHomepage,
                            module: module[moduleName]
                        });

                        Logger.log(`Module: ${moduleName} - version: ${moduleVersion} loaded`, 'LoaderModule');
                    }
                });
            }

            HelperFileTools.saveObjectByNewFile(MODULE_LIST, this._modulesArray);
            return {
                module: LoaderModule,
                imports: [...this._modulesArray.map(module => module.module)],
            } as DynamicModule;
        });
    }

    private static _loadModule(modulePath: string): Promise<DynamicModule> {
        return import(modulePath);
    }
}
