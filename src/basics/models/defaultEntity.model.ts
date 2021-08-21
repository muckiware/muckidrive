/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import {
    Column,
    VersionColumn,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    ManyToOne, JoinColumn
} from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { UsersModel, LanguagesModel } from './index';

export class DefaultEntityTables {

    /**
     * Table for category language items 
     */
    public static readonly TABLE_CATEGORIES_TRANSLATION = 'catalog_categories_translation'

    /**
     * Global existing languages and specific language settingd
     */
    public static readonly TABLE_LANGUAGES = 'core_languages';

    /**
     * table for modules
     */
    public static readonly TABLE_MODULES = 'core_modules';

    /**
     * table for module config items
     */
     public static readonly TABLE_MODULES_CONFIG = 'core_modules_config';

    /**
     * Existing stores
     */
    public static readonly TABLE_STORES = 'core_stores';

    /**
     * Translation items for existing stores
     */
    public static readonly TABLE_STORES_TRANSLATION = 'core_stores_translation';

    /**
     * Table of system users
     */
    public static readonly TABLE_USERS = 'core_users';
}

@ObjectType()
export abstract class DefaultEntityModel {

    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field({ nullable: true })
    @Column()
    createDateTime: Date;

    @Column()
    createUserId: number;

    @Field(type => UsersModel, { nullable: true })
    @ManyToOne(type => UsersModel, (users) => users.id)
    @JoinColumn([{ name: 'createUserId', referencedColumnName: 'id' }])
    createUser: UsersModel

    @Field({ nullable: true })
    @Column({ nullable: true })
    updateDateTime?: Date;

    @Column({ nullable: true })
    updateUserId?: number;

    @Field(type => UsersModel, { nullable: true })
    @ManyToOne(type => UsersModel, (user) => user.id)
    @JoinColumn([{ name: 'updateUserId', referencedColumnName: 'id' }])
    updateUser?: UsersModel

    @Field({ nullable: true })
    @VersionColumn()
    version: number;
}

export abstract class DefaultUserLessEntityModel {

    @Field(type => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field({ nullable: true })
    @Column()
    createDateTime: Date;

    @Field({ nullable: true })
    @Column({ nullable: true })
    updateDateTime?: Date;

    @Field({ nullable: true })
    @VersionColumn()
    version: number;
}

@ObjectType()
export abstract class DefaultTranslationEntityModel {

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field({ nullable: true })
    @Column()
    title: string;

    @Field({ nullable: true })
    @Column('longtext', { nullable: true })
    description: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    seoTitle: string;

    @Field({ nullable: true })
    @Column('longtext', { nullable: true })
    seoKeys: string;

    @Field({ nullable: true })
    @Column('longtext', { nullable: true })
    seoDescription: string;

    @Field({ nullable: true })
    @PrimaryColumn({ unique: true })
    languageId: number;

    @Field(type => LanguagesModel, { nullable: true })
    @ManyToOne(type => LanguagesModel, (language) => language.id)
    @JoinColumn([{ name: 'languageId', referencedColumnName: 'id' }])
    language: LanguagesModel

    @Field({ nullable: true })
    @Column('boolean', { default: true })
    isActive: boolean;
}