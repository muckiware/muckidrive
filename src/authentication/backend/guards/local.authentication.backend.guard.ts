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

@Injectable()
export class LocalAuthenticationBackendGuard extends AuthGuard('local') {

    constructor() {
        super();
    }  

    async canActivate(context: ExecutionContext): Promise<boolean> {

        await super.canActivate(context);
        const ctx = GqlExecutionContext.create(context);
        const request  = ctx.getContext();
        request.body = ctx.getArgs();

        return true;
    }

    getRequest(context: ExecutionContext) {

        const ctx = GqlExecutionContext.create(context);
        const request  = ctx.getContext();
        request.body = ctx.getArgs();

        return request;
    }
}
