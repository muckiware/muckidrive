/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';

import { UsersModel, CreateUsersDto } from '../models';
// import { HelperStringTools } from '@muckidrive/helper'
import { HelperStringTools } from '../../helper';
@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>
    ) {}

    create(createCategoryDto: CreateUsersDto): Promise<UsersModel> {

        const user = new UsersModel();
        user.uuid = uuidv4();
        user.name = createCategoryDto.name;
        user.userName = createCategoryDto.userName;
        user.firstName = createCategoryDto.firstName;
        user.lastName = createCategoryDto.lastName;
        user.eMail = createCategoryDto.eMail;
        user.password = HelperStringTools.createHashPassword(createCategoryDto.password);
        user.isActive = createCategoryDto.isActive;
        user.isSystemUser = createCategoryDto.isSystemUser;
        user.languageId = createCategoryDto.languageId;
        user.createDateTime = new Date(DateTime.utc().toString());

        return this.usersRepository.save(user);
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

    findOne(id: number): Promise<UsersModel> {
        return this.usersRepository.findOne(id);
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