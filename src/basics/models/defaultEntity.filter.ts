/**
 * @package     muckiDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

//Import Framework parts
import { Injectable } from '@nestjs/common';
import {
    Equal,
    Like,
    Not,
    In,
    FindOperator,
    IsNull,
    MoreThan,
    LessThan,
    LessThanOrEqual,
    MoreThanOrEqual,
    Between
} from 'typeorm';

import{ filterOperators } from '../index';

@Injectable()
export class DefaultEntityFilter {

    private _operator: filterOperators;

    private _field: string;

    private _value: string;

    private _orFilters: any = [];

    private _andFilters: any;

    public get operator(): filterOperators {
        return this._operator
    }

    public set operator(operator: filterOperators) {
        this._operator = operator;
    }

    public get field(): string {
        return this._field
    }

    public set field(field: string) {
        this._field = field;
    }

    public get value() {
        return this._value
    }

    public set value(value: any) {
        this._value = value;
    }

    public get orFilters(): [] {
        return this._orFilters;
    }

    public set orFilters(andFilters: []) {

        if(andFilters.length >= 1) {
            this._orFilters.push(andFilters);
        }
    }

    public get andFilters() {
        return this._andFilters;
    }

    public resetAndFilters() {
        this._andFilters = [];
    }

    public setAndFilters(key: string, andFilterValues: {}) {

        if(key === '') {
            throw 'Missing filter key';
        }
        
        this._andFilters[key] = andFilterValues;
        this._andFilters.length = this._andFilters.length +1
    }

    public getFilterObject(): FindOperator<any> {

        if(!this._operator || !this._value) {
            throw 'Filter parameter incomplete';
        }

        switch(this._operator) {

            case 'eq':
                return Equal(this._value);
            case 'neq':
                return Not(Equal(this._value));
            case 'like':
                return Like('%' + this._value + '%');
            case 'nlike':
                return Not(Like('%' + this._value + '%'));
            case 'in':
                if (!this._value.includes(',')) {
                    throw 'Unvalid filter input value for -in- operator';
                }
                return In(this._value.split(','));
            case 'nin':
                if (!this._value.includes(',')) {
                    throw 'Unvalid filter input value for -notin- operator';
                }
                return Not(In(this._value.split(',')));
            case 'null':
                return IsNull();
            case 'nnull':
                return Not(IsNull());
            case 'gt':
                return MoreThan(this._value);
            case 'lt':
                return LessThan(this._value);
            case 'gteq':
                return MoreThanOrEqual(this._value);
            case 'lteq':
                return LessThanOrEqual(this._value);
            case 'between':
                if (!this._value.includes(',')) {
                    throw 'Unvalid filter input value for -between- operator';
                }
                var inputValue = this._value.split(',', 2);
                return Between(inputValue[0], inputValue[1]);
            default:
                throw 'Missing valid filter operator';
        }
    }

    public resetFilters() {

        this._andFilters  = [];
        this._orFilters  = [];
    }
}