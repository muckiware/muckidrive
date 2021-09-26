// /**
//  * @package     muckiwareDrive
//  * @subpackage  Server
//  *
//  * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
//  * @license MIT
//  * @link https://github.com/muckiware/muckidrive
//  */

// import { Args, Int, Mutation, Query, Resolver, Subscription, Context } from '@nestjs/graphql';
// import { UseGuards, SetMetadata } from '@nestjs/common';
// import { PubSub } from 'apollo-server-express';

// import { LoaderModel, LoaderService, LoaderModelOutput } from './index'
// import { DefaultEntityPaginationInput, DefaultEntityFilterInput, UsersService, UsersModel, BasicsService } from '../basics';

// import { JwtAuthenticationBackendGuard } from '../authentication/backend';
// import { 
//     AuthorizationRolesGuard,
//     AuthorizationBackendActions,
//     RoleMetadata
// } from '../authorization/backend';
// import { validate } from 'graphql';

// const pubSub = new PubSub();

// @Resolver(of => LoaderModel)

// export class LoaderResolver {

//     public static ruleName = 'coreLoader';

//     constructor(
//        private readonly loaderService: LoaderService,
//     //    private readonly basicsService: BasicsService
//     ) {}

//     // @SetMetadata(
//     //     RoleMetadata.context,
//     //     AuthorizationBackendActions.read
//     // )
//     //@UseGuards(JwtAuthenticationBackendGuard)
//     // @UseGuards(AuthorizationRolesGuard)
//     @Query(() => LoaderModelOutput, { name: 'coreModules', description: 'List of installed modules' })
//     public async coreModules(
//         @Args({
//             name: 'pagination',
//             type: () => DefaultEntityPaginationInput,
//             nullable: true
//           }) entityPaginationInput: DefaultEntityPaginationInput,
//         @Args({
//             name: 'filter',
//             type: () => DefaultEntityFilterInput,
//             nullable: true
//         }) entityFilerInput: DefaultEntityFilterInput,
//         @Context() context
//     ): Promise<LoaderModelOutput> {

//         // console.log('context category res', context.req.headers);
//         // let result = await this.loaderService.findAndCountAll(entityPaginationInput);

//         return this.loaderService.findAndCountAll(entityPaginationInput);
//     }
// }
