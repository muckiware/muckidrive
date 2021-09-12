/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { validate, ValidationError } from 'class-validator'

import { UsersModel, NewUserInput } from '../models';
import { HelperStringTools } from '../../helper';
@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>
    ) {}

    async create(createCategoryDto: NewUserInput): Promise<UsersModel> {

        let createUsersData = new NewUserInput();
        createUsersData.eMail = createCategoryDto.eMail;
        createUsersData.name = createCategoryDto.name;
        createUsersData.userName = createCategoryDto.userName;
        createUsersData.firstName = createCategoryDto.firstName;
        createUsersData.lastName = createCategoryDto.lastName;
        createUsersData.isActive = createCategoryDto.isActive;
        createUsersData.isSystemUser = createCategoryDto.isSystemUser;
        createUsersData.languageId = createCategoryDto.languageId;
        createUsersData.password = createCategoryDto.password;

        let validateInputs: ValidationError[] = await validate(createUsersData);
        if(validateInputs.length >= 1) {
            throw new BadRequestException('Unvalid input data', validateInputs.toString());
        }

        const user = new UsersModel();
        Object.assign(user, createCategoryDto);

        if(createCategoryDto.uuid !== '') {
            user.uuid = createCategoryDto.uuid;
        } else {
            user.uuid = uuidv4();
        }
        user.password = HelperStringTools.createHashPassword(createCategoryDto.password);
        user.createDateTime = new Date(DateTime.utc().toString());

        console.log('save user', user);
        return await this.usersRepository.save(user);
    }

    async findAll(orderField = 'id', sortDirection = 'ASC', skip = 0, take = 10): Promise<UsersModel[]> {
        return this.usersRepository.find(
            { 
                skip: skip,
                take: take,
                order: {
                    [orderField]: sortDirection
                }
            }
        );
    }

    public async findOne(id: number): Promise<UsersModel> {

        if(id < 0) {
            throw new BadRequestException('Unvalid input data, missing id input');
        }

        const user = await this.usersRepository.findOne({
            id,
        });
        if (!user) {
            throw new NotFoundException('No user found');
        }

        return user
    }

    /**
     * Search for account backend user by uuid string as varchar(32) input
     * @param userId
     * @returns 
     */
    findUserByUuid(userId: string): Promise<UsersModel> {

        return this.usersRepository.findOne({
            where:  {
                uuid: userId
            }
        });
    }

    /**
     * Search for account backend user by email string input
     * @param userId
     * @returns 
     */
    findUserByNameEmail(username: string): Promise<UsersModel> {

        return this.usersRepository.findOne({
            where:[
                { eMail: username },
                { userName: username}
            ]
        });
    }

    /**
     * Search for system user
     * @returns UsersModel
     */
     findSystemUser(): Promise<UsersModel> {

        return this.usersRepository.findOne({
            where:  {
                isSystemUser: true
            },
        });
    }

    async remove(id: string): Promise<void> {

        // const category = await this.findOne(id);
        // await category.destroy();

        await this.usersRepository.delete(id);
    }

    public async countAll(): Promise<number> {
        return this.usersRepository.count();
    }
}