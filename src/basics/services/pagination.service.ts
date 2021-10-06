/**
 * @package     muckiwareDrive
 * @subpackage  Server core
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

//Import Framework parts
import { Injectable, BadRequestException } from '@nestjs/common';
import { DefaultEntityPaginationInput } from '../../basics';

@Injectable()
export class BasicServicePagination {

    public readonly DEFAULT_TAKE = 50;
    public readonly DEFAULT_SKIP = 1;

    constructor() {}

    public getSkipValue(perPage: number, pageNumber: number): number {

        if(perPage < 1 || pageNumber < 1) {
            throw new BadRequestException('Unvalid input data for getSkipValue(), missing pageNumber or perPage');
        }

        let result: number = (perPage * pageNumber) - perPage;

        switch (true) {
            case (pageNumber === 1):
                return 0;
            case (result < perPage):
                return 0;
            case (perPage === 1):
                return pageNumber -1;
            default:
                return result;
        }
    }

    public getNextPageNumber(perPage: number, pageNumber: number, total: number): number {

        if(perPage < 1 || pageNumber < 1) {
            throw new BadRequestException('Unvalid input data for getNextPageNumber(), missing pageNumber, perPage or total');
        }

        if(total === 0) {
            return 0;
        }

        let result: number = pageNumber + 1;
        let maxPage: number = Math.ceil(total / perPage);

        switch (true) {
            case (result >= maxPage):
                return maxPage;
            case (result < maxPage):
                return result;
            default:
                return 2;
        }
    }

    public getPrevPageNumber(perPage: number, pageNumber: number, total: number): number {

        if(perPage < 1 || pageNumber < 1 || total < 0) {
            throw new BadRequestException('Unvalid input data for getPrevPageNumber(), missing pageNumber, perPage or total');
        }

        if(total === 0) {
            return 0;
        }

        let result: number = pageNumber - 1;
        let maxPage: number = Math.ceil(total / perPage);


        switch (true) {
            case (result <= 1):
                return 1
            case (result > 1 && result < maxPage):
                return result;
            default:
                return maxPage -1;
        }
    }

    public getPagination(total: number, entityPaginationInput: DefaultEntityPaginationInput) {

        if(total > 0) {
            return {
                total: total,
                maxPage: Math.ceil(total / entityPaginationInput.perPage),
                prevPage: this.getPrevPageNumber(entityPaginationInput.perPage, entityPaginationInput.pageNumber, total),
                currentPage: entityPaginationInput.pageNumber,
                nextPage: this.getNextPageNumber(entityPaginationInput.perPage, entityPaginationInput.pageNumber, total)
            }
        } else {
            return {
                total: 0,
                maxPage: 0,
                prevPage: 0,
                currentPage: 0,
                nextPage: 0
            }
        }
    }
}
