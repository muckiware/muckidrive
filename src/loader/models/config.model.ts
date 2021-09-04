/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Column, Entity, ManyToOne } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

// import { DefaultEntityTables, DefaultEntityModel } from '@muckidrive/basics';
import { DefaultEntityTables, DefaultEntityModel } from '../../basics';

import { LoaderModel } from './loader.model'

@Entity({
    name: DefaultEntityTables.TABLE_MODULES_CONFIG,
})
@ObjectType()
export class ConfigModel extends DefaultEntityModel {

    @ManyToOne(type => LoaderModel, (module) => module.id)
    module: number;

    @Field({ nullable: true })
    @Column({ unique: true })
    key: string;

    @Field({ nullable: true })
    @Column('longtext', { nullable: true })
    value: string;

    @Field()
    @Column()
    type: string;

    @Field({ nullable: true })
    @Column('boolean', { default: false })
    isActive: boolean;
}
