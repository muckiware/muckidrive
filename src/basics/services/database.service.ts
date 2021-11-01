/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

//Import Framework parts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection } from "typeorm";

//Import Smoppit sales parts
import { HelperStringTools } from '../../helper';
import { DefaultEntityFilterInput, DefaultEntityFilterInputItems, DefaultEntityFilter } from '../../basics';

@Injectable()
export class DatabaseService {

    protected tableName: string;
    protected entityFilterInputs: DefaultEntityFilterInput[];

    constructor(
        private connection: Connection,
        private configService: ConfigService,
        private defaultEntityFilter: DefaultEntityFilter
    ) {}

    public setTableName(tableName: string) {
        this.tableName = tableName;
    }

    public setEntityFilterInputs(entityFilterInputs: DefaultEntityFilterInput[]) {
        this.entityFilterInputs = entityFilterInputs;
    }

    public async checkMysqlTableField(columnName: string) {

        return await this.connection.query(
            'SELECT * FROM information_schema.columns ' +
            'WHERE ' +
            '   table_schema = \'' + this.configService.get<string>('db.database') + '\' AND ' +
            '   Table_name = \'' + this.configService.get<string>('db.entityPrefix') + HelperStringTools.quoteInput(this.tableName) + '\' AND ' +
            '   column_name = \'' + HelperStringTools.quoteInput(columnName) + '\''
        )
    }

    public async createFilter() {

        this.defaultEntityFilter.resetFilters();

        if(this.tableName === undefined) {
            throw 'Missing table name for filter';
        }

        if(this.entityFilterInputs === undefined) {
            throw 'Missing filter imputs';
        }

        if(this.checkTableFields()) {

            //OR-loop
            for (let entityFilterInput of this.entityFilterInputs) {

                this.defaultEntityFilter.resetAndFilters();

                //AND-loop
                for (let filterDefinition of entityFilterInput.filterDefinition) {

                    this.defaultEntityFilter.operator = filterDefinition.operator;
                    this.defaultEntityFilter.value = filterDefinition.term;

                    var filterObject = this.defaultEntityFilter.getFilterObject();
                    this.defaultEntityFilter.setAndFilters(filterDefinition.field, filterObject);
                }

                this.defaultEntityFilter.orFilters = this.defaultEntityFilter.andFilters;
            }

            return this.defaultEntityFilter.orFilters;
        } else {
            return null;
        }
    }

    public async checkTableFields(): Promise<boolean> {

        let checkedFields = [];

        for (let entityFilterInput of this.entityFilterInputs) {

            for (let filterDefinition of entityFilterInput.filterDefinition) {

                if(checkedFields.indexOf(this.tableName + '.' + filterDefinition.field) === -1) {

                    //Check database field by request only if necessary
                    let fieldCheckerResult;

                    switch (this.configService.get<string>('db.type')) {

                        case 'mysql':
                            fieldCheckerResult = await this.checkMysqlTableField(filterDefinition.field);
                            break;
                    
                        default:
                            fieldCheckerResult = ['true']
                            break;
                    }
                    
                    if(fieldCheckerResult.length === 0) {
                        throw 'Database field ' + this.tableName + '.' + filterDefinition.field + ' does not exists';
                    } else {
                        checkedFields.push(this.tableName + '.' + filterDefinition.field);
                    }
                }
            }
        }

        return true;
    }
}
