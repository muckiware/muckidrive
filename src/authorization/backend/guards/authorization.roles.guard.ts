/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService} from '@nestjs/config';

import { UsersService, UsersModel } from '@muckidrive/basics';
import {
    AuthorizationBackendService,
    AuthorizationUserRuleBackendModel,
    RoleMetadata
} from '../index';

import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthorizationRolesGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private usersService: UsersService,
        private authorizationBackendService: AuthorizationBackendService,
        private configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const bearer: string = this.getHeadersBearer(context);
        const classContent: any = context.getClass();

        if(jwt.verify(bearer, this.configService.get<string>('auth.backend.jwt.secret'))) {

            let currentJwtContent: any = jwt.decode(bearer);
            let currentUser: UsersModel = await this.usersService.findUserByNameEmail(currentJwtContent.username);

            let authorizationUser: AuthorizationUserRuleBackendModel = await this.authorizationBackendService.findOneByUserId(currentUser.id);
            let privileges = authorizationUser.authorizationRules.privileges.split(',');
            let needRule: string = classContent.ruleName + '.' + this.reflector.get<string[]>(RoleMetadata.context, context.getHandler());

            if(privileges.includes(needRule) || currentUser.isAdminUser) {
                return true;
            }
        }

        return false;
    }

    private getHeadersBearer(context: ExecutionContext): string {

        const ctx = GqlExecutionContext.create(context);

        const authorization = ctx.getContext().req.headers.authorization.split(' ');
        if(authorization.includes('Bearer')) {
            return authorization[1];
        }

        return '';
    }
}
