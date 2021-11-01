/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { } from 'typeorm';
import { IsOptional, MaxLength, MinLength, IsPositive, IsString, IsInt, Min, Max } from 'class-validator';

export enum sortDirections {
    ASC = 'ASC',
    DESC = 'DESC',
    ONE = 1,
    MINUSONE = -1
}

registerEnumType(sortDirections, { name: 'sortDirections' })

export enum filterOperators {
    EQ = 'eq',
    NEQ = 'neq',
    LIKE = 'like',
    NLIKE = 'nlike',
    IN = 'in',
    NIN = 'nin',
    NULL = 'null',
    NNULL = 'nnull',
    GT = 'gt',
    LT = 'lt',
    GTEQ = 'gteq',
    LTEQ = 'lteq',
    BETWEEN = 'between'
}

registerEnumType(filterOperators, { name: 'filterOperators' })

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

    @Field(type => [DefaultEntityFilterInputItems], { 
        nullable: true,
        description: 'Filter string input'
    })
    @IsOptional()
    filterDefinition: DefaultEntityFilterInputItems[];
}

@InputType()
export class DefaultEntityFilterInputItems {

    @Field({ 
        nullable: true,
        description: 'Serach term as string input'
    })
    @MinLength(3)
    @MaxLength(255)
    @IsString()
    term: string;

    @Field(
        type => filterOperators,{ 
            nullable: true,
            description: 'Operator like equal or not null'
        }
    )
    @MinLength(2)
    @MaxLength(6)
    @IsString()
    operator: filterOperators;

    @Field({ 
        nullable: true,
        description: 'Database field'
    })
    @MinLength(2)
    @MaxLength(45)
    @IsString()
    field: string;
}
