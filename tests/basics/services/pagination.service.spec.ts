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

import { BasicServicePagination } from '../../../src/basics';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PaginationBasicsService', () => {
     
    let basicServicePagination: BasicServicePagination;
 
    beforeEach(async () => {

        const moduleRefPagination: TestingModule = await Test.createTestingModule({
            providers: [
                Reflector,
                BasicServicePagination,
            ],
        }).compile();

        basicServicePagination = moduleRefPagination.get<BasicServicePagination>(BasicServicePagination);
        moduleRefPagination.close
    });
 
    describe('Basics Pagination Service', () => {

        describe('getNextPageNumber()', () => {

            it('function should throw an input error with 15, 0, 35 as input', async () => {

                expect.assertions(2);

                try {
                    await basicServicePagination.getNextPageNumber(15, 0, 35);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data for getNextPageNumber(), missing pageNumber, perPage or total');
                }
            });

            it('function should throw an input error with 0, 16, 35 as input', async () => {

                expect.assertions(2);

                try {
                    await basicServicePagination.getNextPageNumber(0, 16, 35);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data for getNextPageNumber(), missing pageNumber, perPage or total');
                }
            });

            it('function should return 0 if total is also 0 with 15, 16, 0 as input params', async () => {

                let result: number = basicServicePagination.getNextPageNumber(15, 16, 0);
                expect(result).toBe(0);
            });

            it('NextPageNumber value should be 2 return with result < maxPage', async () => {

                let result: number = basicServicePagination.getNextPageNumber(8, 1, 32);
                expect(result).toBe(2);
            });

            it('NextPageNumber value should be 2 return with result >= maxPage', async () => {

                let total = 32;
                let perPage = 8;
                let result: number = basicServicePagination.getNextPageNumber(perPage, 4, total);
                expect(result).toBe(Math.ceil(total / perPage));
            });

            it('NextPageNumber value should be 2 return with result >= maxPage', async () => {

                let total = 32;
                let perPage = 8;
                let result: number = basicServicePagination.getNextPageNumber(1, 1, 1);
                expect(result).toBe(1);
            });
        });

        describe('getPrevPageNumber()', () => {

            it('function should throw an input error with 15, 0, 35 as input', async () => {

                expect.assertions(2);

                try {
                    await basicServicePagination.getPrevPageNumber(15, 0, 35);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data for getPrevPageNumber(), missing pageNumber, perPage or total');
                }
            });

            it('function should throw an input error with 0, 16, 35 as input', async () => {

                expect.assertions(2);

                try {
                    await basicServicePagination.getPrevPageNumber(0, 16, 35);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data for getPrevPageNumber(), missing pageNumber, perPage or total');
                }
            });

            it('function should return 0 if total is also 0 with 15, 16, 0 as input params', async () => {

                let result: number = basicServicePagination.getPrevPageNumber(15, 16, 0);
                expect(result).toBe(0);
            });
        });

        describe('check getSkipValue()', () => {

            it('function should throw an input error', async () => {

                expect.assertions(2);

                try {
                    await basicServicePagination.getSkipValue(15, 0);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data for getSkipValue(), missing pageNumber or perPage');
                }
            });

            it('function should throw an input error', async () => {

                expect.assertions(2);

                try {
                    await basicServicePagination.getSkipValue(0, 16);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Unvalid input data for getSkipValue(), missing pageNumber or perPage');
                }
            });

            it('skip value should be 15 as default return value', async () => {

                let result: number = basicServicePagination.getSkipValue(15, 2);
                expect(result).toBe(15);
            });

            it('skip value should be 0 as pageNumber === 1 return value', async () => {

                let result: number = basicServicePagination.getSkipValue(20, 1);
                expect(result).toBe(0);
            });

            it('skip value should be 28 as default return value', async () => {

                let result: number = basicServicePagination.getSkipValue(14, 3);
                expect(result).toBe((14 * 3) -14);
            });

            it('skip value should be 24 as perPage === 1 return value', async () => {

                let result: number = basicServicePagination.getSkipValue(1, 25);
                expect(result).toBe(25 -1);
            });

            it('skip value should be 0 as result < perPage return value', async () => {

                let result: number = basicServicePagination.getSkipValue(1, 1);
                expect(result).toBe(0);
            })
        })
    });
});
