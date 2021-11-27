 /**
 * @package     muckiDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ConfigService} from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import faker, { fake } from 'faker';
import { validate } from 'class-validator'
import { DateTime } from 'luxon';

import {
    LoaderService,
    LoaderModel,
    NewModuleInput,
    UpdateModuleInput
} from '../../../src/loader';
import { BasicServicePagination, DatabaseService } from '../../../src/basics';
import { getRepositoryToken } from '@nestjs/typeorm';


class LoaderServiceMock {

    public create(): void {}
    public async save(): Promise<void> {}
}

class BasicServicePaginationMock {
 
    public getSkipValue(perPage: number, pageNumber: number): number {

        return 1;
    }
}

class DatabaseServiceMock {}
class EventEmitterMock {

    public emit(event: symbol|string, data: any) {
        return 1;
    }
}

describe('LoaderService', () => {
     
    let loaderService: LoaderService;
    let loaderRepository: Repository<LoaderModel>;
 
    beforeEach(async () => {

        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [ 
                LoaderService,
                Reflector,
                {
                    provide: getRepositoryToken(LoaderModel),
                    useClass: LoaderServiceMock,
                },
                {
                    provide: BasicServicePagination,
                    useClass: BasicServicePaginationMock,
                },
                {
                    provide: DatabaseService,
                    useClass: DatabaseServiceMock,
                },
                {
                    provide: EventEmitter2,
                    useClass: EventEmitterMock,
                }
            ],
        }).compile();

        loaderService = moduleRef.get<LoaderService>(LoaderService);
        loaderRepository = moduleRef.get(getRepositoryToken(LoaderModel));
    });
 
    describe('Create items for module', () => {

        const systemUserId = 1;

        const createModuleData: NewModuleInput = {
            name: faker.lorem.word(10),
            description: faker.lorem.words(14),
            moduleVersion: faker.lorem.word(10),
            isActive: true,
            author: faker.name.firstName() + ' ' + faker.name.lastName(),
            vendor: faker.company.companyName(),
            license: faker.lorem.word(4),
            keywords: faker.lorem.words(12),
            homepage: faker.internet.url()
        };

        describe('Checkup module name input', () => {

            expect.assertions(2);

            it('throws an error when name is null', async () => {

                createModuleData.name = null;
                try {
                    let result: LoaderModel = await loaderService.create(systemUserId, createModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                createModuleData.name = faker.lorem.word(10);
            });

            it('throws an error when name is too short', async () => {

                createModuleData.name = faker.lorem.word(2);
                try {
                    let result: LoaderModel = await loaderService.create(systemUserId, createModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                createModuleData.name = faker.lorem.word(10);
            });

            it('throws an error when name is too long', async () => {

                createModuleData.name = faker.lorem.word(280);
                try {
                    let result: LoaderModel = await loaderService.create(systemUserId, createModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                createModuleData.name = faker.lorem.word(10);
            });
        });

        describe('Checkup module description input', () => {

            expect.assertions(2);

            it('throws an error when desc is too short', async () => {

                createModuleData.description = faker.lorem.word(2);
                try {
                    let result: LoaderModel = await loaderService.create(systemUserId, createModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                createModuleData.description = faker.lorem.word(10);
            });
        });

        describe('Checkup module isActive input', () => {

            expect.assertions(2);

            it('throws an error when isActive is null', async () => {

                createModuleData.isActive = null;
                try {
                    let result: LoaderModel = await loaderService.create(systemUserId, createModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                createModuleData.isActive = true;
            });
        });

        describe('Checkup module moduleVersion input', () => {

            expect.assertions(2);

            it('throws an error when moduleVersion is emtpy', async () => {

                createModuleData.moduleVersion = '';
                try {
                    let result: LoaderModel = await loaderService.create(systemUserId, createModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                createModuleData.moduleVersion = faker.lorem.word(10)
            });

            it('throws an error when moduleVersion is too long', async () => {

                createModuleData.moduleVersion = faker.lorem.word(11);
                try {
                    let result: LoaderModel = await loaderService.create(systemUserId, createModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                createModuleData.moduleVersion = faker.lorem.word(10)
            });
        });

        describe('Checkup module author input', () => {

            expect.assertions(2);

            it('throws an error when author is emtpy', async () => {

                createModuleData.moduleVersion = '';
                try {
                    let result: LoaderModel = await loaderService.create(systemUserId, createModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                createModuleData.author = faker.name.firstName() + ' ' + faker.name.lastName()
            });

            it('throws an error when author is too short', async () => {

                createModuleData.author = faker.lorem.word(2);
                try {
                    let result: LoaderModel = await loaderService.create(systemUserId, createModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                createModuleData.author = faker.name.firstName() + ' ' + faker.name.lastName()
            });

            it('throws an error when author is too long', async () => {

                createModuleData.author = faker.lorem.word(290);
                try {
                    let result: LoaderModel = await loaderService.create(systemUserId, createModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                createModuleData.author = faker.name.firstName() + ' ' + faker.name.lastName()
            });
        });

        it('create module with correct paramaters', async () => {

            expect.assertions(2);

            const name = faker.lorem.word(10);

            const createModuleData: any = {
                id: 1,
                description: faker.lorem.words(14),
                moduleVersion: faker.lorem.word(10),
                isActive: true,
                author: faker.name.firstName() + ' ' + faker.name.lastName(),
                vendor: faker.company.companyName(),
                license: faker.lorem.word(4),
                keywords: faker.lorem.words(12),
                homepage: faker.internet.url(),
                name,
            };

            const saveModule = LoaderModel.getModel({
                id: 1,
                name: name,
                description: faker.lorem.words(14),
                moduleVersion: faker.lorem.word(10),
                isActive: true,
                author: faker.name.firstName() + ' ' + faker.name.lastName(),
                vendor: faker.company.companyName(),
                license: faker.lorem.word(4),
                keywords: faker.lorem.words(12),
                homepage: faker.internet.url()
            });
      
            jest.spyOn(loaderRepository, 'save').mockResolvedValue(saveModule);

            try {
                let result = await loaderService.create(systemUserId, createModuleData);
                expect(result.name).toEqual(name);
                expect(result.isActive).toBeTruthy();
            } catch (error) {
                console.log('error create module:', error);
            }
        });
    });

    describe('Update items for module', () => {

        const systemUserId = 1;

        const updateModuleData: UpdateModuleInput = {
            id: 1,
            name: faker.lorem.word(10),
            description: faker.lorem.words(14),
            moduleVersion: faker.lorem.word(10),
            isActive: true,
            author: faker.name.firstName() + ' ' + faker.name.lastName(),
            vendor: faker.company.companyName(),
            license: faker.lorem.word(4),
            keywords: faker.lorem.words(12),
            homepage: faker.internet.url()
        };

        describe('Checkup name input for module', () => {

            expect.assertions(2);

            it('throws an error when name is null', async () => {

                updateModuleData.name = null;
                try {
                    let result: LoaderModel = await loaderService.update(1, systemUserId, updateModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                updateModuleData.name = faker.lorem.word(10);
            });

            it('throws an error when name is too short', async () => {

                updateModuleData.name = faker.lorem.word(2);
                try {
                    let result: LoaderModel = await loaderService.update(1, systemUserId, updateModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                updateModuleData.name = faker.lorem.word(10);
            });

            it('throws an error when name is too long', async () => {

                updateModuleData.name = faker.lorem.word(280);
                try {
                    let result: LoaderModel = await loaderService.update(1, systemUserId, updateModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                updateModuleData.name = faker.lorem.word(10);
            });
        });

        describe('Checkup for module description input', () => {

            expect.assertions(2);

            it('throws an error when desc is too short', async () => {

                updateModuleData.description = faker.lorem.word(2);
                try {
                    let result: LoaderModel = await loaderService.update(1, systemUserId, updateModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                updateModuleData.description = faker.lorem.word(10);
            });
        });

        describe('Checkup module isActive input', () => {

            expect.assertions(2);

            it('throws an error when isActive is null', async () => {

                updateModuleData.isActive = null;
                try {
                    let result: LoaderModel = await loaderService.update(1, systemUserId, updateModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                updateModuleData.isActive = true;
            });
        });

        describe('Checkup module moduleVersion input', () => {

            expect.assertions(2);

            it('throws an error when moduleVersion is empty', async () => {

                updateModuleData.moduleVersion = '';
                try {
                    let result: LoaderModel = await loaderService.update(1, systemUserId, updateModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                updateModuleData.moduleVersion = faker.lorem.word(10);
            });

            it('throws an error when moduleVersion is too long', async () => {

                updateModuleData.moduleVersion = faker.lorem.word(11);
                try {
                    let result: LoaderModel = await loaderService.update(1, systemUserId, updateModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                updateModuleData.moduleVersion = faker.lorem.word(10);
            });
        });
    });
});
