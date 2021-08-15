/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-core';

@Injectable()
export class JwtAuthenticationBackendGuard extends AuthGuard('jwt') {

    getRequest(context: ExecutionContext) {

        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        return request;
    }
    
    handleRequest(err: any, user: any, info: any) {

        if (err || !user) {
          throw err || new AuthenticationError('Could not authenticate with token');
        }
        return user;
    }
}
