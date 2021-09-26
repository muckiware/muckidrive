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
import faker from 'faker';
import { validate } from 'class-validator'

import { UsersService, UsersModel, CreateUsersDto, NewUserInput } from '../../../src/basics';
import { getRepositoryToken } from '@nestjs/typeorm';


class UsersServiceMock {

    public create(): void {}
    public async save(): Promise<void> {}
    public async remove(): Promise<void> {}
    public async findOne(): Promise<void> {}
    public async findAll(): Promise<void> {}
    public async indUserByUuid(): Promise<void> {}
    public async findUserByNameEmail(): Promise<void> {}
    public async findSystemUser(): Promise<void> {}
    public async countAll(): Promise<void> {}
}

describe('UsersService', () => {
     
    let usersService: UsersService;
    let userRepository: Repository<UsersModel>;
 
    beforeEach(async () => {

        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [ 
                UsersService,
                {
                    provide: getRepositoryToken(UsersModel),
                    useClass: UsersServiceMock,
                }
            ],
        }).compile();

        usersService = moduleRef.get<UsersService>(UsersService);
        userRepository = moduleRef.get(getRepositoryToken(UsersModel));
    });
 
    describe('Create new user', () => {

        const createUsersData: NewUserInput = {
            name: faker.lorem.word(10),
            eMail: faker.internet.email(),
            userName: faker.lorem.word(10),
            firstName: faker.name.firstName(1),
            lastName: faker.name.lastName(1),
            password: faker.internet.password(10),
            isActive: true,
            languageId: 1,
            isSystemUser: true
        };

        expect.assertions(2);

        describe('Checkup email input', () => {

            it('throws an error when email is missing', async () => {

                createUsersData.eMail = '';
                try {
                    await usersService.create(createUsersData);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }
            });
    
            it('throws an error when email is wrong', async () => {
    
                createUsersData.eMail = 'terd@';
                try {
                    await usersService.create(createUsersData);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data');
                }
                createUsersData.eMail = faker.internet.email();
            });
        });

        it('throws an error when password is too short', async () => {

            createUsersData.password = '1234567';
            try {
                await usersService.create(createUsersData);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('Unvalid input data');
            }
            createUsersData.password = faker.internet.password(10);
        });

        it('throws an error when uuid is unvalid', async () => {

            createUsersData.uuid = 'abcd-123';
            try {
                await usersService.create(createUsersData);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('Unvalid input data');
            }
            createUsersData.uuid = null;
        });

        it('throws an error when languageId is missing', async () => {

            createUsersData.languageId = null;
            try {
                await usersService.create(createUsersData);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('Unvalid input data');
            }
            createUsersData.languageId = 1;
        });

        it('throws an error when isActive status is missing', async () => {

            createUsersData.isActive = null;
            try {
                await usersService.create(createUsersData);
            } catch (error) {
                expect(error).toBeInstanceOf(BadRequestException);
                expect(error.message).toBe('Unvalid input data');
            }
            createUsersData.isActive = true;
        });
        

        it('calls the repository with correct paramaters', async () => {

            expect.assertions(2);
      
            const email = faker.internet.email();

            const createUsersData: any = {
                id: 1,
                name: faker.lorem.word(),
                uuid: faker.datatype.uuid(),
                eMail: faker.internet.email(),
                userName: faker.lorem.word(10),
                firstName: faker.name.firstName(1),
                lastName: faker.name.lastName(1),
                password: faker.internet.password(10),
                isActive: true,
                isSystemUser: false,
                isAdminUser: true,
                languageId: 1,
                email,
            };

            const saveUser = UsersModel.getModel({
                id: 1,
                name: faker.lorem.word(),
                uuid: faker.datatype.uuid(),
                eMail: email,
                userName: faker.lorem.word(10),
                firstName: faker.name.firstName(1),
                lastName: faker.name.lastName(1),
                password: faker.internet.password(10),
                isActive: true,
                isSystemUser: false,
                isAdminUser: true,
                languageId: 1
            });
      
            jest.spyOn(userRepository, 'save').mockResolvedValue(saveUser);
 
            const result = await usersService.create(createUsersData);
            expect(result.eMail).toEqual(email);
            expect(result.isActive).toBeTruthy();
        });
    });

    describe('finding a user', () => {

        it('throws an error when a user doesnt exist', async () => {

            const id = faker.random.number();
    
            const userRepositoryFindOneSpy = jest
                .spyOn(userRepository, 'findOne')
                .mockResolvedValue(null);
    
            expect.assertions(3);
        
            try {
                await usersService.findOne(id);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe('No user found');
            }
    
            expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
                id,
            });
        });
    
        it('returns the found user', async () => {

            expect.assertions(2);

            const id = faker.random.number();
            const email = faker.internet.email();
    
            const existingUser = UsersModel.getModel({
                id: id,
                name: faker.lorem.word(),
                uuid: faker.datatype.uuid(),
                eMail: email,
                userName: faker.lorem.word(10),
                firstName: faker.name.firstName(1),
                lastName: faker.name.lastName(1),
                password: faker.internet.password(10),
                isActive: true,
                isSystemUser: false,
                isAdminUser: true,
            });
    
            const userRepositoryFindOneSpy = jest
                .spyOn(userRepository, 'findOne')
                .mockResolvedValue(existingUser);
    
            const result = await usersService.findOne(id);
    
            expect(result.id).toBe(existingUser.id);
            expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
                id: id,
            });
        });
    });
});
