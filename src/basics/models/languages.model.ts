/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

import { DefaultEntityTables, DefaultUserLessEntityModel} from './defaultEntity.model';

@Entity({
    name: DefaultEntityTables.TABLE_LANGUAGES,
})
@ObjectType()
export class LanguagesModel extends DefaultUserLessEntityModel {

    @Field({ nullable: true })
    @Column()
    name: string;

    @Field({ nullable: true })
    @Column('longtext', { nullable: true })
    description: string;

    @Field({ nullable: true })
    @Column('boolean', { default: false })
    isActive: boolean;

    @Field({ nullable: true })
    @Column('boolean', { default: false, unique: true })
    isDefault: boolean;

    @Field({ nullable: true })
    @Column({ length: 2, nullable: true})
    code: string;

    @Field({ nullable: true })
    @Column({ unique: true, length: 5 })
    codeLong: string;

    @Field({ nullable: true })
    @Column({ length: 2, nullable: true })
    codeLocale: string;

    @Field({ nullable: true })
    @Column({ length: 6, nullable: true })
    codeCulture: string;

    @Field({ nullable: true })
    @Column({ length: 3, nullable: true })
    Iso639xValue: string;
}