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
import { Repository } from 'typeorm';

import { AuthorizationUserRuleBackendModel } from '../index'

@Injectable()
export class AuthorizationBackendService {

    constructor(
        @InjectRepository(AuthorizationUserRuleBackendModel)
        private readonly authorizationUserRuleRepository: Repository<AuthorizationUserRuleBackendModel>,
    ) {}

    /**
     * Search for role by user id
     * @param userId
     * @returns 
     */
    findOneByUserId(userId: number): Promise<AuthorizationUserRuleBackendModel> {

        return this.authorizationUserRuleRepository.findOne({
            relations: [
                'authorizationRules'
            ],
            where:  {
                userId: userId
            }
        });
    }
}
