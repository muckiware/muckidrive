/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

//Import Framework parts
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager'

// import { LoaderService, LoaderModel, ConfigModel } from '@muckidrive/loader'
import { LoaderService, LoaderModel, ConfigModel } from '../../loader';

@Injectable()
export class ModuleConfigService {

    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        private readonly loaderService: LoaderService
    ) {}

    async getValueByKey(moduleName: string, key: string, defaultValue: any = null): Promise<any> {

        let valueItem: string = moduleName + '.' + key;
        let returnValue = await this.cacheManager.get(valueItem);

        if(returnValue === undefined) {

            let module: LoaderModel = await this.loaderService.findModuleByName(moduleName);
            let returnValueIndex: number = module.config.findIndex((configItems: ConfigModel) => configItems.key == key);

            if(returnValueIndex !== -1) {

                let typedValue = this.getTypedValue(
                    module.config[returnValueIndex].value,
                    module.config[returnValueIndex].type
                )

                await this.setValueByKey(valueItem, typedValue);
                return typedValue;
            } else {

                if(defaultValue) {
                    return defaultValue;
                } else {
                    return null;
                }
            }
        } else {
            return returnValue;
        }
    }

    async setValueByKey(key: string, value: any) {
        await this.cacheManager.set(key, value);
    }

    getTypedValue(value: any, type: string) {

        switch (type) {

            case 'string':
                return value;

            case 'number':
                return parseInt(value);
            
            case 'float':
                return parseFloat(value);

            case 'boolean':
                if(value === '1') {
                    return true;
                } else {
                    return false;
                }
        
            default:
                return null;
        }
    }
}