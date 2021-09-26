/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Column, PrimaryGeneratedColumn, Entity, OneToMany, JoinColumn } from 'typeorm';
import { Field, ID, ObjectType, InputType, Int } from '@nestjs/graphql';

// import { DefaultEntityTables, DefaultEntityModel } from '@muckidrive/basics';
import { DefaultEntityTables, DefaultEntityModel, TPagination } from '../../basics';

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
    config: ConfigModel[]

    @Field({ nullable: true })
    @Column({ nullable: true })
    author: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    vendor: string;

    @Field({ nullable: true })
    @Column({ length: 25, nullable: true })
    license: string;

    @Field({ nullable: true })
    @Column('longtext', { nullable: true })
    keywords: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    homepage: string;
}

@ObjectType()
export class LoaderModelOutput {

    @Field(() => [LoaderModel])
    items: LoaderModel[];

    @Field(() => TPagination)
    pagination: TPagination;
} 
