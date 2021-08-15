/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsBoolean, Length, MaxLength, MinLength, IsNumber } from 'class-validator';

export class CreateLanguageDto {

    /**
     * Designation of language
     */
    name: string;

    /**
     * Description of the language
     */
    description?: string;

    /**
     * Field for active or inactive language item
     */
    isActive: boolean;

    /**
     * Field for active or inactive language item
     */
    isDefault: boolean;

    /**
     * Langauge code like de, en, fr
     */
    code: string;

    /**
     * Long language code like de-DE, en-US, en-GB
     */
    codeLong: string;

    codeLocale: string;

    codeCulture: string;

    Iso639xValue: string;
}

@InputType()
export class NewLanguageInput {

    @Field()
    @MinLength(1)
    @MaxLength(250)
    name: string;

    @Field({ nullable: true })
    @MinLength(3)
    @IsOptional()
    description?: string;

    @Field({ defaultValue: true })
    @IsBoolean()
    isActive: boolean;

    @Field({ defaultValue: true })
    @IsBoolean()
    isDefault: boolean;

    @Field()
    @Length(2)
    code: string;

    @Field()
    @Length(5)
    codeLong: string;

    @Field()
    @Length(2)
    @IsOptional()
    codeLocale?: string;

    @Field()
    @Length(6)
    @IsOptional()
    codeCulture?: string;

    @Field()
    @Length(3)
    @IsOptional()
    Iso639xValue?: string;
}

@InputType()
export class UpdateLanguageInput {

    @Field()
    @IsOptional()
    @MinLength(1)
    @MaxLength(250)
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @MinLength(3)
    description?: string;

    @Field({ defaultValue: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @Field({ defaultValue: true })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @Field()
    @IsOptional()
    @Length(2)
    code?: string;

    @Field()
    @IsOptional()
    @Length(5)
    codeLong?: string;

    @Field()
    @IsOptional()
    @Length(2)
    codeLocale?: string;

    @Field()
    @IsOptional()
    @Length(6)
    codeCulture?: string;

    @Field()
    @IsOptional()
    @Length(3)
    Iso639xValue?: string;
}