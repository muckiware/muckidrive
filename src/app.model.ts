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
export class AppModel {

    @Field()
    shopName: string;

    @Field({ nullable: true })
    shopDescription?: string;
}
