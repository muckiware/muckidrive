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
import { Repository, getConnection, Equal } from 'typeorm';
import { DateTime } from 'luxon';
import * as lodash from 'lodash';

import { LoaderModel, CreateLoaderDto, NewModuleInput, UpdateModuleInput, LoaderModelOutput } from '../../loader';
import { DefaultEntityPaginationInput, BasicsService } from '../../basics';

@Injectable()
export class LoaderService {

    constructor(
        @InjectRepository(LoaderModel)
        private readonly loaderRepository: Repository<LoaderModel>,
        private readonly basicsService: BasicsService
    ) {}

    public create(systemUserId: number, CreateLoaderDto: NewModuleInput): Promise<LoaderModel> {

        const module = new LoaderModel();
        module.name = CreateLoaderDto.name;
        module.description = CreateLoaderDto.description;
        module.moduleVersion = CreateLoaderDto.moduleVersion;
        module.isActive = true;
        module.author = CreateLoaderDto.author;
        module.vendor = CreateLoaderDto.vendor;
        module.license = CreateLoaderDto.license;
        module.keywords = CreateLoaderDto.keywords;
        module.homepage = CreateLoaderDto.homepage;
        module.createDateTime = new Date(DateTime.utc().toString());
        module.createUserId = systemUserId

        return this.loaderRepository.save(module);
    }

    public update(moduleId: number, systemUserId: number, CreateLoaderDto: NewModuleInput): Promise<LoaderModel> {

        const module = new LoaderModel();
        module.id = moduleId;
        module.name = CreateLoaderDto.name;
        module.description = CreateLoaderDto.description;
        module.moduleVersion = CreateLoaderDto.moduleVersion;
        module.isActive = true;
        module.author = CreateLoaderDto.author;
        module.vendor = CreateLoaderDto.vendor;
        module.license = CreateLoaderDto.license;
        module.keywords = CreateLoaderDto.keywords;
        module.homepage = CreateLoaderDto.homepage;
        module.updateDateTime = new Date(DateTime.utc().toString());
        module.updateUserId = systemUserId

        return this.loaderRepository.save(module);
    }

    async resetModuleStatus(systemUserId: number) {

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
    async findAndCountAll(entityPaginationInput: DefaultEntityPaginationInput = {}, withoutFilter: boolean = false): Promise<LoaderModelOutput> {

        let result: any;
        if(withoutFilter || lodash.isEmpty(entityPaginationInput)) {

            console.log('without filter')
            result = await this.loaderRepository.findAndCount({

                relations: [
                    'config',
                ]
            });
        } else {

            result = await this.loaderRepository.findAndCount({

                relations: [
                    'config',
                ],
                skip: this.basicsService.getSkipValue(entityPaginationInput.perPage, entityPaginationInput.pageNumber),
                take: entityPaginationInput.perPage,
                order: {
                    [entityPaginationInput.orderField]: entityPaginationInput.sortDirection
                }
            });
        }

        return {
            items: result[0],
            total: result[1],
            maxPage: Math.ceil(result[1] / entityPaginationInput.perPage),
            prevPage: this.basicsService.getPrevPageNumber(entityPaginationInput.perPage, entityPaginationInput.pageNumber, result[1]),
            currentPage: entityPaginationInput.pageNumber,
            nextPage: this.basicsService.getNextPageNumber(entityPaginationInput.perPage, entityPaginationInput.pageNumber, result[1])
        }
    }

    async findAll(entityPaginationInput: DefaultEntityPaginationInput = {}, withoutFilter: boolean = false): Promise<LoaderModel[]> {

        if(withoutFilter || lodash.isEmpty(entityPaginationInput)) {

            console.log('without filter')
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
        
        this.loaderRepository.delete({
            name: Equal(moduleName)
        });
    }
 }