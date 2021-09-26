/**
 * @package     muckiDrive
 * @subpackage  Server core
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TPagination {

    @Field(() => Int)
    total: Number;

    @Field(() => Int)
    maxPage: Number;

    @Field(() => Int)
    prevPage: Number;

    @Field(() => Int)
    currentPage: Number;

    @Field(() => Int)
    nextPage: Number;
}