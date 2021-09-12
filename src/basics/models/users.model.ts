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
    JoinColumn,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Entity,
    ManyToOne
} from 'typeorm';
import { Field, Int, ObjectType, ID } from '@nestjs/graphql';

import { DefaultEntityTables, DefaultUserLessEntityModel, LanguagesModel } from './index';

@Entity({
    name: DefaultEntityTables.TABLE_USERS,
    synchronize: true,
})
@ObjectType()
export class UsersModel extends DefaultUserLessEntityModel {

    @Field()
    @PrimaryGeneratedColumn('uuid')
    uuid: string

    @Field({ nullable: true })
    @Column()
    name: string;

    @Field()
    @PrimaryColumn()
    eMail: string;

    @Field()
    @PrimaryColumn()
    userName: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    firstName: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    lastName: string;

    @Field()
    @Column()
    password: string;

    @Field({ nullable: true })
    @Column('boolean', { default: true })
    isActive: boolean;

    @Field({ nullable: true })
    @Column('boolean', { default: false, unique: true })
    isSystemUser: boolean;

    @Field({ nullable: true })
    @Column('boolean', { default: false })
    isAdminUser: boolean;

    @Field(type => Int, { nullable: true })
    @Column()
    languageId: number;

    @Field({ nullable: true })
    @ManyToOne(type => LanguagesModel, (language) => language.id)
    @JoinColumn([{ name: 'languageId', referencedColumnName: 'id' }])
    defaultLanguage: LanguagesModel

    /**
     * Static merthod for to create model for testings
     * 
     * @param params 
     * @returns 
     */
    public static getModel(params: Partial<UsersModel>): UsersModel {

        const usersModel = new UsersModel();
        Object.assign(usersModel, params);
    
        return usersModel;
    }
}
