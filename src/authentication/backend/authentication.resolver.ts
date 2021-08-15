/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import {
    AuthenticationBackendModel,
    LocalAuthenticationBackendGuard,
    JwtAuthenticationBackendGuard,
    AuthenticationService,
    TokenBackendModel
} from './index';

@Resolver(of => AuthenticationBackendModel)
export class AuthBackendResolver {

    constructor(
        private authService: AuthenticationService
    ) {}

    @UseGuards(LocalAuthenticationBackendGuard)
    @Mutation(returns => TokenBackendModel)
    public async coreBackendLogin(
        @Args('username') username: string,
        @Args('password') password: string
    ): Promise<{}> {

        return this.authService.createToken(username);
    }
}