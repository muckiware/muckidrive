/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';

export class AuthDto {

    username: string;

    password: string;

    rememberMe: boolean;
}

export class BackendAuthenticationResultDto {

    accessToken: string;
}

@InputType()
export class AuthInput {

    @Field()
    @MinLength(8)
    @MaxLength(250)
    username: string;

    @Field()
    @MinLength(8)
    @MaxLength(250)
    password: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    rememberMe?: boolean;
}
