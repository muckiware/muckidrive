 /**
 * @package     muckiDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ConfigService} from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import faker from 'faker';
import { validate } from 'class-validator'

import {
    DefaultEntityFilter,
    DefaultEntityFilterInputItems,
    filterOperators
} from '../../../src/basics';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DefaultEntityFilter', () => {
     
    let defaultEntityFilter : DefaultEntityFilter ;

    let inputItems: DefaultEntityFilterInputItems = {
        field: 'key',
        operator: filterOperators.LIKE,
        term: 'test'
    }
 
    beforeEach(async () => {

        const moduleRefPagination: TestingModule = await Test.createTestingModule({
            providers: [
                Reflector,
                DefaultEntityFilter ,
            ],
        }).compile();

        defaultEntityFilter = moduleRefPagination.get<DefaultEntityFilter >(DefaultEntityFilter );
        moduleRefPagination.close
    });
 
    describe('Default entity filter model', () => {

        describe('setAndFilters()', () => {

            it('function should throw an input error with empty key string as input', async () => {

                expect.assertions(2);

                try {
                    await defaultEntityFilter.setAndFilters('', {});
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Missing filter key input value');
                }
            });

            it('function should set input array for filter object', async () => {

                expect.assertions(2);
                defaultEntityFilter.resetAndFilters();

                try {
                    await defaultEntityFilter.setAndFilters(inputItems.field, { test: "test item"});
                } catch (error) {
                    console.log(error);
                }

                expect(defaultEntityFilter.andFilters.length).toBe(1);
                expect(defaultEntityFilter.andFilters.key.test).toBe('test item')
            });
        });

        describe('getFilterObject()', () => {

            it('function should throw an input error with empty value and operator', async () => {

                expect.assertions(2);
                defaultEntityFilter.operator = null;
                defaultEntityFilter.value = null;

                try {
                    let result = await defaultEntityFilter.getFilterObject();
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Filter parameter incomplete');
                }
            });
        });
    });
});
