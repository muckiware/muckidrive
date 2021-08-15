/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Field, ObjectType } from '@nestjs/graphql';


@ObjectType()
export class AuthenticationBackendModel {

    /**
     * Needs to be as designation username, but can also be an email address
     */
    @Field()
    username: string;

    @Field()
    password: string;

    @Field({ nullable: true })
    rememberMe: boolean;
}

@ObjectType()
export class TokenBackendModel {

    @Field()
    access_token: string;
}