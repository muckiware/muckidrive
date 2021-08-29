/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Logger, Module, OnModuleInit, OnApplicationBootstrap } from '@nestjs/common';

import { HelperFileTools } from '@muckidrive/helper';
import {
    LanguagesService,
    UsersService,
    UsersModel,
    BasicsService
} from '@muckidrive/basics';
import { LoaderService, LoaderModel, NewModuleInput } from '@muckidrive/loader';

@Module({})
export class InitModule implements OnApplicationBootstrap {

    private _defaultArray: any;
    private needLanguageDefaults: boolean;
    private needUserDefaults: boolean;

    constructor(
        private readonly languagesService: LanguagesService,
        private readonly usersService: UsersService,
        private readonly loaderService: LoaderService,
        private readonly basicsService: BasicsService
    ) {
        this._defaultArray = new Array();
        this.languagesService = languagesService;
        this.usersService = usersService;
        this.loaderService = loaderService;
    }

    onApplicationBootstrap() {

        this._loadDefaults();
        this._saveModules();
    }

    private async _saveModules(): Promise<any> {

        let moduleList: NewModuleInput[] = HelperFileTools.getObjectByFile(this.basicsService.getModuleListPath());
        let moduleListDb: LoaderModel[] = await this.loaderService.findAll();
        let systemUser: UsersModel = await this.usersService.findSystemUser();

        if(systemUser.id >=1 ) {
            this._createNewModules(moduleList, moduleListDb, systemUser.id);
        } else {
            Logger.error('Missing system user!', 'InitModule');
        }
        this._removeOldModules(moduleList, moduleListDb);
    }

    private _createNewModules(moduleList: NewModuleInput[], moduleListDb: LoaderModel[], systemUserId: number): void {

        for (let index = 0; index < moduleList.length; index++) {

            const elementName = moduleList[index]['name'];
            if(elementName !== '') {

                let newModuleIndex = moduleListDb.findIndex((module: LoaderModel) => module.name == elementName);
                if(newModuleIndex === -1) {
                    this.loaderService.create(systemUserId, moduleList[index]);
                }
            }
        }
    }

    private _removeOldModules(moduleList: NewModuleInput[], moduleListDb: LoaderModel[]): void {

        for (let index = 0; index < moduleListDb.length; index++) {

            const elementName = moduleListDb[index]['name'];
            if(elementName !== '') {

                let oldModuleIndex = moduleList.findIndex((module: LoaderModel) => module.name == elementName);
                if(oldModuleIndex === -1) {
                    this.loaderService.removeByName(elementName);
                }
            }
        }
    }

    private async _loadDefaults(): Promise<any> {

        if(await this.languagesService.countAll() === 0) {
            this.needLanguageDefaults = true;
        }

        if(await this.usersService.countAll() === 0) {
            this.needUserDefaults = true;
        }
  
        HelperFileTools.findFilesByExtension(this.basicsService.getDefaultsPath(), 'defaults.json').forEach(filePath => {

            this._defaultArray.push(
                HelperFileTools.getObjectByFile(filePath)
            );
        });

        return Promise.all(this._defaultArray).then((allDefaultItems: any) => {

            allDefaultItems.forEach(async(defaultItems: any) => {

                defaultItems.forEach(async(defaultItem: any) => {

                    switch (defaultItem.table) {

                        case 'core_languages':
                            if(this.needLanguageDefaults) {
                                await this.languagesService.create(defaultItem);
                            }
                            break;
                        case 'core_users':
                            if(this.needUserDefaults) {
                                await this.usersService.create(defaultItem);
                            }
                            break;
                    
                        default:
                            Logger.error('Missing or wrong table attribute in default setup!', 'InitModule');
                            Logger.error(defaultItem, 'InitModule');
                    }
                });
            });
        });
    }
}
