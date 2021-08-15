/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Column, Entity } from 'typeorm';

import { DefaultEntityTables, DefaultEntityModel, DefaultTranslationEntityModel } from './defaultEntity.model';

@Entity({
    name: DefaultEntityTables.TABLE_STORES
})
export class Stores extends DefaultEntityModel {

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column('boolean', { default: false})
    isActive: boolean;

    @Column({ default: 0})
    order: number;
}

@Entity({
    name: DefaultEntityTables.TABLE_STORES_TRANSLATION
})
export class StoresTranslation extends DefaultTranslationEntityModel {

    @Column()
    storeId: number;
}