/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Test } from '@nestjs/testing';

import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager'

import { LoaderService, LoaderModel, ConfigModel } from '@muckidrive/loader'
import { ModuleConfigServiceInterface } from './index';

// describe('CatsController', () => {

//     let catsController: CatsController;
//     let catsService: CatsService;
  
//     beforeEach(async () => {
//         const moduleRef = await Test.createTestingModule({
//             controllers: [CatsController],
//             providers: [CatsService],
//         }).compile();
  
//         catsService = moduleRef.get<CatsService>(CatsService);
//         catsController = moduleRef.get<CatsController>(CatsController);
//     });
  
//     describe('findAll', () => {
//       it('should return an array of cats', async () => {
//         const result = ['test'];
//         jest.spyOn(catsService, 'findAll').mockImplementation(() => result);
  
//         expect(await catsController.findAll()).toBe(result);
//       });
//     });
//   });
