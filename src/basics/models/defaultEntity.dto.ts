/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsOptional, MaxLength, MinLength, IsPositive, IsString, IsInt, Min, Max } from 'class-validator';

export enum sortDirections {
    ASC = 'ASC',
    DESC = 'DESC',
    ONE = 1,
    MINUSONE = -1
}

registerEnumType(sortDirections, { name: 'sortDirections' })

@InputType()
export class DefaultEntityPaginationInput {

    @Field({ 
        nullable: true,
        defaultValue: 'id',
        description: 'Field name for which should sort the results'
    })
    @MinLength(2)
    @MaxLength(250)
    @IsString()
    @IsOptional()
    orderField?: string;

    @Field(
        type => sortDirections,
        { 
            nullable: true,
            defaultValue: sortDirections.ASC,
            description: 'Sort direction for result list with Ascending (ASC) or Descending (DESC)'
        }
    )
    @IsOptional()
    sortDirection?: sortDirections;

    @Field({ 
        nullable: true,
        defaultValue: 1, 
        description: 'Number of page'
    })
    @Min(1)
    @Max(1000)
    @IsInt()
    @IsPositive()
    @IsOptional()
    pageNumber?: number;

    @Field({ 
        nullable: true,
        defaultValue: 50,
        description: 'Limit of result items for each page - (Pagination)'
    })
    @Min(1)
    @Max(250)
    @IsInt()
    @IsPositive()
    @IsOptional()
    perPage?: number;
}

@InputType()
export class DefaultEntityFilterInput {

    @Field({ 
        nullable: true,
        description: 'Filter string input'
    })
    @MinLength(5)
    @MaxLength(255)
    @IsString()
    @IsOptional()
    filterDefinition: string;
}
