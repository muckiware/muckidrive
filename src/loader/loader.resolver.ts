/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Args, Int, Mutation, Query, Resolver, Subscription, Context } from '@nestjs/graphql';
import { UseGuards, SetMetadata } from '@nestjs/common';
import { PubSub } from 'apollo-server-express';

import { LoaderModel, LoaderService } from './index'
import { DefaultEntityPaginationInput, UsersService, UsersModel } from '@muckidrive/basics'
import { JwtAuthenticationBackendGuard } from '../authentication/backend';
import { 
    AuthorizationRolesGuard,
    AuthorizationBackendActions,
    RoleMetadata
} from '../authorization/backend';

const pubSub = new PubSub();

@Resolver(of => LoaderModel)

export class LoaderResolver {

    public static ruleName = 'coreLoader';

    constructor(
       private readonly loaderService: LoaderService
    ) {}

    // @SetMetadata(
    //     RoleMetadata.context,
    //     AuthorizationBackendActions.read
    // )
    // @UseGuards(JwtAuthenticationBackendGuard)
    //@UseGuards(AuthorizationRolesGuard)
    //@UseGuards(LoaderGuard)
    @Query(returns => [LoaderModel])
    public coreModules(
        @Args('entityPaginationInput') entityPaginationInput: DefaultEntityPaginationInput,
        @Context() context
    ): Promise<LoaderModel[]> {

        // console.log('context category res', context.req.headers);
        return this.loaderService.findAll(entityPaginationInput);
    }
}
