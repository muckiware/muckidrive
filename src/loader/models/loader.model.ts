/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Column, PrimaryGeneratedColumn, Entity, OneToMany, JoinColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

import { DefaultEntityTables, DefaultEntityModel } from '@muckidrive/basics';

import { ConfigModel } from './config.model';

@Entity({
    name: DefaultEntityTables.TABLE_MODULES,
})
@ObjectType()
export class LoaderModel extends DefaultEntityModel {

    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ unique: true })
    name: string;

    @Field({ nullable: true })
    @Column('longtext', { nullable: true })
    description: string;

    @Field()
    @Column({ length: 10 })
    moduleVersion: string;

    @Field()
    @Column('boolean', { default: false })
    isActive: boolean;

    @Field(type => [ConfigModel], { nullable: true })
    @OneToMany(type => ConfigModel, (config) => config.module)
    @JoinColumn([{ name: 'id', referencedColumnName: 'moduleId' }])
    //@JoinColumn([{ name: 'moduleId', referencedColumnName: 'id' }])
    config: ConfigModel[]

    @Field()
    @Column({ nullable: true })
    author: string;

    @Field()
    @Column({ nullable: true })
    vendor: string;

    @Field()
    @Column({ length: 25, nullable: true })
    license: string;

    @Field()
    @Column('longtext', { nullable: true })
    keywords: string;

    @Field()
    @Column({ nullable: true })
    homepage: string;
}
