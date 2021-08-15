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

export class CreateLoaderDto {

    name: string;

    description: string;

    moduleVersion: string;

    isActive: boolean;

    author: string;

    vendor: string;

    license: string;

    keywords: string;

    homepage: string;
}

@InputType()
export class NewModuleInput {

    @Field()
    @MinLength(3)
    @MaxLength(250)
    name: string;

    @Field({ nullable: true })
    @MinLength(3)
    @IsOptional()
    description: string;

    @Field()
    @MinLength(1)
    @MaxLength(10)
    moduleVersion: string;

    @Field()
    @IsBoolean()
    isActive: boolean;

    @Field()
    @MinLength(3)
    @MaxLength(250)
    @IsOptional()
    author: string;

    @Field()
    @MinLength(3)
    @MaxLength(250)
    @IsOptional()
    vendor: string;

    @Field()
    @MinLength(1)
    @MaxLength(25)
    @IsOptional()
    license: string;

    @Field()
    @MinLength(3)
    @IsOptional()
    keywords: string;

    @Field()
    @MinLength(6)
    @MaxLength(250)
    @IsOptional()
    homepage: string;
}

@InputType()
export class UpdateModuleInput {

    @Field()
    @MinLength(3)
    @MaxLength(250)
    name?: string;

    @Field({ nullable: true })
    @MinLength(3)
    @IsOptional()
    description?: string;

    @Field()
    @MinLength(1)
    @MaxLength(10)
    moduleVersion?: string;

    @Field()
    @IsBoolean()
    isActive?: boolean;

    @Field()
    @MinLength(3)
    @MaxLength(250)
    @IsOptional()
    author?: string;

    @Field()
    @MinLength(3)
    @MaxLength(250)
    @IsOptional()
    vendor?: string;

    @Field()
    @MinLength(1)
    @MaxLength(25)
    @IsOptional()
    license?: string;

    @Field()
    @MinLength(3)
    @IsOptional()
    keywords?: string;

    @Field()
    @MinLength(6)
    @MaxLength(250)
    @IsOptional()
    homepage?: string;
}