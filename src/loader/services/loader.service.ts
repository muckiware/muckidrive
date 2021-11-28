/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

//Import Framework parts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository, getConnection, Equal } from 'typeorm';
import { DateTime } from 'luxon';
import * as lodash from 'lodash';
import { validate, ValidationError } from 'class-validator'
import { HelperStringTools } from '../../helper';
import { LoaderCreateEvent } from '../index';

import {
    LoaderModel,
    LoaderPropertiesDto,
    NewModuleInput,
    UpdateModuleInput,
    LoaderModelOutput
} from '../../loader';
import {
    DefaultEntityPaginationInput,
    BasicServicePagination,
    DefaultEntityFilterInput,
    DatabaseService
} from '../../basics';

@Injectable()
export class LoaderService {

    constructor(
        @InjectRepository(LoaderModel)
        private readonly loaderRepository: Repository<LoaderModel>,
        private readonly basicServicePagination: BasicServicePagination,
        private readonly databaseService: DatabaseService,
        private eventEmitter: EventEmitter2
    ) {}

    public async create(systemUserId: number, loaderProperties: NewModuleInput): Promise<LoaderModel> {

        let moduleData = new NewModuleInput();
        moduleData.name = loaderProperties.name;
        moduleData.description = loaderProperties.description;
        moduleData.moduleVersion = loaderProperties.moduleVersion;
        moduleData.isActive = true;
        moduleData.author = loaderProperties.author;
        moduleData.vendor = loaderProperties.vendor;
        moduleData.license = loaderProperties.license;
        moduleData.keywords = loaderProperties.keywords;
        moduleData.homepage = loaderProperties.homepage;

        let validateInputs: ValidationError[] = await validate(moduleData);
        if(validateInputs.length >= 1) {
            throw new BadRequestException('Unvalid input data', validateInputs.toString());
        }

        const module = new LoaderModel();
        Object.assign(module, moduleData);

        module.createDateTime = new Date(DateTime.utc().toString());
        module.createUserId = systemUserId

        const loaderCreateBeforeEvent = new LoaderCreateEvent();
        this.eventEmitter.emit('loader.create.before', module);

        let result = await this.loaderRepository.save(module);

        const loaderCreateAfterEvent = new LoaderCreateEvent();
        this.eventEmitter.emit('loader.create.after', result);

        return result;
    }

    public async update(moduleId: number, systemUserId: number, loaderProperties: UpdateModuleInput): Promise<LoaderModel> {

        // const moduleData = new UpdateModuleInput();
        let moduleData = new LoaderModel();
        moduleData.id = moduleId;
        moduleData.name = loaderProperties.name;
        moduleData.description = loaderProperties.description;
        moduleData.moduleVersion = loaderProperties.moduleVersion;
        moduleData.isActive = true;
        moduleData.author = loaderProperties.author;
        moduleData.vendor = loaderProperties.vendor;
        moduleData.license = loaderProperties.license;
        moduleData.keywords = loaderProperties.keywords;
        moduleData.homepage = loaderProperties.homepage;

        let validateInputs: ValidationError[] = await validate(moduleData);
        if(validateInputs.length >= 1) {
            throw new BadRequestException('Unvalid input data', validateInputs.toString());
        }

        const module = new LoaderModel();
        Object.assign(module, moduleData);

        module.updateDateTime = new Date(DateTime.utc().toString());
        module.updateUserId = systemUserId

        this.eventEmitter.emit('loader.update.before', module);
        let result = this.loaderRepository.save(module);
        this.eventEmitter.emit('loader.update.before', result);
        return result;
    }

    async resetModuleStatus(systemUserId: number) {

        if(systemUserId <= 0) {
            throw new BadRequestException('Unvalid input data', 'systemUserId <= is not allowed');
        }

        await getConnection()
            .createQueryBuilder()
            .update(LoaderModel)
            .set({ 
                isActive: false,
                updateDateTime: new Date(DateTime.utc().toString()),
                updateUserId: systemUserId
            })
            .execute();
    }

    /**
     * Search for module item by name as input
     * 
     * @param codeLong string
     * @returns LoaderModel
     */
    public async findModuleByName(moduleName: string): Promise<LoaderModel> {

        let result =  await this.loaderRepository.findOne({

            relations: [
                'config',
            ],
            where:  {
                name: moduleName
            }
        });

        return result;
    }

    public clearTable(): Promise<void> {
        return this.loaderRepository.clear()
    }

    /**
     * Method for to get all modules in database
     * 
     * DefaultEntityPaginationInput: 
     *     - skip = Offset (paginated) where from entities should be taken.
     *     - take = Limit (paginated) - max number of entities should be taken.
     *     - oder = { <Name of field>: <ASC/DESC> }
     * @param entityPaginationInput 
     * @returns 
     */
    async findAndCountAll(
        entityPaginationInput: DefaultEntityPaginationInput = {},
        entityFilterInput: DefaultEntityFilterInput[],
        withoutFilter: boolean = false
    ): Promise<LoaderModelOutput> {

        let filter = null;
        let result: any;

        if(entityFilterInput.length >= 1) {

            try {
                this.databaseService.setTableName(this.loaderRepository.metadata.givenTableName);
                this.databaseService.setEntityFilterInputs(entityFilterInput);
                filter = await this.databaseService.createFilter();
            } catch (error) {
                throw new BadRequestException('Unvalid create filter', error);
            }
        } else {
            this.databaseService.setTableName(null);
            this.databaseService.setEntityFilterInputs(null);
        }

        if(withoutFilter || lodash.isEmpty(entityPaginationInput)) {

            result = await this.loaderRepository.findAndCount({

                relations: [
                    'config',
                ],
                where: filter
            });
        } else {

            result = await this.loaderRepository.findAndCount({

                relations: [
                    'config',
                ],
                skip: this.basicServicePagination.getSkipValue(entityPaginationInput.perPage, entityPaginationInput.pageNumber),
                take: entityPaginationInput.perPage,
                order: {
                    [entityPaginationInput.orderField]: entityPaginationInput.sortDirection
                },
                where: filter
            });
        }

        return {
            items: result[0],
            pagination: this.basicServicePagination.getPagination(result[1], entityPaginationInput)
        }
    }

    async findAll(entityPaginationInput: DefaultEntityPaginationInput = {}, withoutFilter: boolean = false): Promise<LoaderModel[]> {

        if(withoutFilter || lodash.isEmpty(entityPaginationInput)) {

            return this.loaderRepository.find({

                relations: [
                    'config',
                ]
            });
        } else {

            return this.loaderRepository.find({

                relations: [
                    'config',
                ],
                skip: entityPaginationInput.pageNumber,
                take: entityPaginationInput.perPage,
                order: {
                    [entityPaginationInput.orderField]: entityPaginationInput.sortDirection
                }
            });
        }
    }

    public removeByName(moduleName: string) {

        if(moduleName === '') {
            throw new BadRequestException('Unvalid input data', 'Empty modulename is not allowed');
        }

        this.eventEmitter.emit('loader.remove.before', moduleName);
        this.loaderRepository.delete({
            name: Equal(moduleName)
        });
        this.eventEmitter.emit('loader.remove.before', moduleName);
    }
}
