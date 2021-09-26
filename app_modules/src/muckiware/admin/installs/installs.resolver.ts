/**
 * @package     muckiwareDrive
 * @subpackage  Server module
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Args, Int, Mutation, Query, Resolver, Subscription, Context } from '@nestjs/graphql';
import { UseGuards, SetMetadata } from '@nestjs/common';
import { PubSub } from 'apollo-server-express';

import { LoaderModel, LoaderModelOutput, LoaderService } from '@muckidrive//loader'
import { DefaultEntityPaginationInput, DefaultEntityFilterInput } from '@muckidrive//basics';
import { JwtAuthenticationBackendGuard } from '@muckidrive/authentication/backend';
import { AuthorizationRolesGuard, AuthorizationBackendActions, RoleMetadata } from '@muckidrive//authorization/backend';
import { LoaderGuard } from '@muckidrive/loader';

const pubSub = new PubSub();

@Resolver(of => LoaderModel)

export class MuckiwareAdminInstallsResolver {

    public static ruleModule = 'MuckiwareAdminInstallsModule'
    public static ruleName = 'muckiwareAdminInstalls';

    constructor(
        private readonly loaderService: LoaderService,
    ) {}

    @SetMetadata(
        RoleMetadata.context,
        AuthorizationBackendActions.read
    )
    @UseGuards(JwtAuthenticationBackendGuard)
    @UseGuards(AuthorizationRolesGuard)
    @UseGuards(LoaderGuard)
    @Query(() => LoaderModelOutput, { name: 'adminInstalls', description: 'List of installed modules' })
    public async adminInstalls(
        @Args({
            name: 'pagination',
            type: () => DefaultEntityPaginationInput,
            nullable: true
        }) entityPaginationInput: DefaultEntityPaginationInput,
        @Args({
            name: 'filter',
            type: () => DefaultEntityFilterInput,
            nullable: true
        }) entityFilerInput: DefaultEntityFilterInput,
        @Context() context
    ): Promise<LoaderModelOutput> {

        return this.loaderService.findAndCountAll(entityPaginationInput);
    }
}
