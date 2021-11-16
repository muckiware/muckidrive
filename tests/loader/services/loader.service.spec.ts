 /**
 * @package     muckiDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ConfigService} from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import faker, { fake } from 'faker';
import { validate } from 'class-validator'
import { DateTime } from 'luxon';

import { LoaderService, LoaderModel, CreateLoaderDto, NewModuleInput } from '../../../src/loader';
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

class DatabaseServiceMock {


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
                }
            ],
        }).compile();

        loaderService = moduleRef.get<LoaderService>(LoaderService);
        loaderRepository = moduleRef.get(getRepositoryToken(LoaderModel));
    });
 
    describe('Create new module item', () => {

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
                    console.log('result output', result);
                } catch (error) {

                    console.log('error output', error);
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                createModuleData.name = faker.lorem.word(10);
            });

            it('throws an error when name is too short', async () => {

                try {
                    let result: LoaderModel = await loaderService.create(systemUserId, createModuleData);
                } catch (error) {

                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }

                createModuleData.name = faker.lorem.word(10);
            });
        });


        // it('create user with correct paramaters', async () => {

        //     expect.assertions(2);
      
        //     const email = faker.internet.email();

        //     const createUsersData: any = {
        //         id: 1,
        //         name: faker.lorem.word(),
        //         uuid: faker.datatype.uuid(),
        //         eMail: faker.internet.email(),
        //         userName: faker.lorem.word(10),
        //         firstName: faker.name.firstName(1),
        //         lastName: faker.name.lastName(1),
        //         password: faker.internet.password(10),
        //         isActive: true,
        //         isSystemUser: false,
        //         isAdminUser: true,
            //     languageId: 1,
            //     email,
            // };

            // const saveUser = UsersModel.getModel({
            //     id: 1,
            //     name: faker.lorem.word(),
            //     uuid: faker.datatype.uuid(),
            //     eMail: email,
            //     userName: faker.lorem.word(10),
            //     firstName: faker.name.firstName(1),
            //     lastName: faker.name.lastName(1),
            //     password: faker.internet.password(10),
            //     isActive: true,
            //     isSystemUser: false,
            //     isAdminUser: true,
            //     languageId: 1
            // });
      
            // jest.spyOn(userRepository, 'save').mockResolvedValue(saveUser);

            // try {
            //     let result = await usersService.create(createUsersData);
            //     expect(result.eMail).toEqual(email);
            //     expect(result.isActive).toBeTruthy();
            // } catch (error) {
            //     console.log(error);
            // }
        // });
    });
});
