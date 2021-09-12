/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Field, InputType } from '@nestjs/graphql';
import {
    IsOptional,
    IsBoolean,
    Length,
    MaxLength,
    MinLength,
    IsNumber,
    IsEmail,
    IsString,
    IsUUID
} from 'class-validator';

export class CreateUsersDto {

    /**
     * id for public output
     */
    uuid: string;

    name: string;

    userName: string;

    firstName: string;

    lastName: string;

    eMail: string;

    password: string;

    isActive: boolean;

    /**
     * Flag, whether item is special system user. Only exists once!
     */
    isSystemUser: boolean;

    languageId: number;
}


@InputType()
export class NewUserInput {

    @Field()
    @IsUUID(4)
    @IsOptional()
    uuid?: string;

    @Field({ nullable: true })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @Field({ nullable: true })
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @IsOptional()
    userName: string;

    @Field({ defaultValue: true })
    @IsString()
    @IsOptional()
    firstName?: string;

    @Field({ defaultValue: true })
    @IsString()
    @IsOptional()
    lastName?: string;

    @Field()
    @IsEmail()
    eMail: string;

    @Field()
    @IsString()
    @MinLength(8)
    @MaxLength(100)
    password: string;

    @Field()
    @IsBoolean()
    isActive: boolean;

    @Field()
    @IsBoolean()
    @IsOptional()
    isSystemUser?: boolean;

    @Field()
    @IsNumber()
    languageId: number;
}

@InputType()
export class UpdateUserInput {

    @Field()
    @IsString()
    @MinLength(1)
    @MaxLength(250)
    uuid: string;

    @Field({ nullable: true })
    @IsString()
    @MinLength(3)
    @MinLength(250)
    name: string;

    @Field({ nullable: true })
    @IsString()
    @MinLength(3)
    @MinLength(250)
    @IsOptional()
    userName: string;

    @Field({ defaultValue: true })
    @IsString()
    @IsOptional()
    firstName?: string;

    @Field({ defaultValue: true })
    @IsString()
    @IsOptional()
    lastName?: string;

    @Field()
    @IsEmail()
    eMail: string;

    @Field()
    @IsString()
    @MinLength(8)
    password: string;

    @Field()
    @IsBoolean()
    isActive: boolean;

    @Field()
    @IsBoolean()
    @IsOptional()
    isSystemUser?: boolean;

    @Field()
    @IsNumber()
    languageId: number;
}