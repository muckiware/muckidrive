/**
 * @package     blog example
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by acme. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Args, Int, Mutation, Query, Resolver, Subscription, Context } from '@nestjs/graphql';
import { UseGuards, SetMetadata } from '@nestjs/common';
 
import { LoaderModel, LoaderService, LoaderModelOutput } from '../../../../src/loader'
import { DefaultEntityPaginationInput, DefaultEntityFilterInput } from '../../../../src/basics';
 
import { JwtAuthenticationBackendGuard } from '../../../../src/authentication/backend';
import { 
    AuthorizationRolesGuard,
    AuthorizationBackendActions,
    RoleMetadata
} from '../../../../src/authorization/backend';
 
@Resolver(of => LoaderModel)
 
export class BlogResolver {

    public static ruleName = 'acmeBlog';

    constructor() {}

    public async acmeBlog(
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
    ): Promise<any> {

        return null
    }
}
 