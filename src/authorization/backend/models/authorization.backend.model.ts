/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Field, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    OneToOne,
    JoinColumn
} from 'typeorm';

import { DefaultEntityModel, UsersModel } from '@muckidrive/basics';

@Entity({
    name: 'core_authorization_rules_backend',
    synchronize: true,
})
@ObjectType()
export class AuthorizationRulesBackendModel extends DefaultEntityModel {

    @Field()
    @Column({ unique: true })
    name: string;

    @Field({ nullable: true })
    @Column('longtext', { nullable: true })
    description: string;

    @Field({ nullable: true })
    @Column('text')
    privileges: string;
}

@Entity({
    name: 'core_authorization_user_rule_backend',
    synchronize: true,
})
@ObjectType()
export class AuthorizationUserRuleBackendModel extends DefaultEntityModel {

    @Field()
    @Column({ unique: true })
    @OneToOne(type => UsersModel, (user) => user.id)
    @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
    userId: number;

    @Column({ nullable: true })
    authorizationRulesId: number;

    @Field()
    @OneToOne(type => AuthorizationRulesBackendModel, (rule) => rule.id)
    @JoinColumn([{ name: 'authorizationRulesId', referencedColumnName: 'id' }])
    authorizationRules: AuthorizationRulesBackendModel
}