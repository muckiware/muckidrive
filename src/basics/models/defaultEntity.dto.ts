/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsOptional, isBoolean, Length, MaxLength, MinLength } from 'class-validator';

export enum sortDirections {
    ASC,
    DESC
}

registerEnumType(sortDirections, { name: 'sortDirections' })

@InputType()
export class DefaultEntityPaginationInput {

    @Field({ nullable: true, defaultValue: 'id', description: 'Offset (paginated) where from entities should be taken.'})
    @MinLength(1)
    @MaxLength(250)
    orderField?: string;

    @Field(type => sortDirections, { nullable: true, defaultValue: sortDirections.ASC, description: 'Sort direction for result list with ASC or DESC'})
    @MinLength(1)
    @MaxLength(250)
    sortDirection?: sortDirections;

    @Field({ nullable: true, defaultValue: 0, description: 'Offset (paginated) where from entities should be taken.'})
    @MinLength(1)
    @MaxLength(250)
    skip?: number;

    @Field({ nullable: true, defaultValue: 0, description: 'Limit (paginated) - max number of entities should be taken.'})
    @MinLength(1)
    @MaxLength(250)
    take?: number;
}

