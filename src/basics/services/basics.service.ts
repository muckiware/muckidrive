/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

//Import Framework parts
import { Injectable, BadRequestException } from '@nestjs/common';

//Import Smoppit sales parts
import { HelperPathTools } from '../../helper'
import { DefaultEntityPaginationInput, sortDirections } from '../index'
import lodash from 'Lodash';

@Injectable()
export class BasicsService {

    public readonly DEFAULT_TAKE = 50;
    public readonly DEFAULT_SKIP = 1;

    constructor(
        private helperPathTools: HelperPathTools
    ) {}

    public getModuleListPath(): string {

		    return this.helperPathTools.getModuleListPath();
	  }

    public getDefaultsPath(): string {

		    return this.helperPathTools.getDefaultsPath();
	  }

    public getSkipValue(perPage: number, pageNumber: number): number {

        if(perPage < 1 || pageNumber < 1) {
            throw new BadRequestException('Unvalid input data for getNextPageNumber(), missing pageNumber or perPage');
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

        if(perPage < 1 || pageNumber < 1 || total <= 1) {
            throw new BadRequestException('Unvalid input data for getNextPageNumber(), missing pageNumber, perPage or total');
        }

        let result: number = pageNumber + 1;
        let maxPage: number = Math.ceil(total / perPage);

        switch (true) {
            case (result <= 1):
                return 2;
            case (result >= maxPage):
                return maxPage;
            case (result < maxPage):
                return result;
            default:
                return 2;
        }
    }

    public getPrevPageNumber(perPage: number, pageNumber: number, total: number): number {

        if(perPage < 1 || pageNumber < 1 || total <= 1) {
            throw new BadRequestException('Unvalid input data for getNextPageNumber(), missing pageNumber, perPage or total');
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

    // public validateEntityPaginationInput(entityPaginationInput: DefaultEntityPaginationInput = {}): DefaultEntityPaginationInput {

    //     let orderField: string = entityPaginationInput.orderField;
    //     let sortDirection: sortDirections = entityPaginationInput.sortDirection;
    //     let skip = this.DEFAULT_SKIP;
    //     let take = this.DEFAULT_TAKE;

    //     if(!lodash.isEmpty(entityPaginationInput.skip)) {
    //         skip = entityPaginationInput.skip;
    //     }

    //     if(!lodash.isEmpty(entityPaginationInput.take)) {
    //       take = entityPaginationInput.take;
    //     }

    //     return {
    //         orderField:orderField,
    //         sortDirection: sortDirection,
    //         skip: skip,
    //         take: take,
    //     }; 
    //}
}