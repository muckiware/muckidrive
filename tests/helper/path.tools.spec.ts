/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Test } from '@nestjs/testing';

import { TestVariables } from '../test.variables';
import { HelperPathTools } from '../../src/helper';

describe('HelperPathTools', () => {

    let helperPathTools: HelperPathTools;

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [ 
                HelperPathTools
            ],
        }).compile();

        helperPathTools = moduleRef.get<HelperPathTools>(HelperPathTools);
    });

    describe('getModuleListPath()', () => {

        it('should return an string', async () => {

            let result = helperPathTools.getModuleListPath();
            expect(result.length).toBeGreaterThan(11);
        });
    });

    describe('getDefaultsPath()', () => {

        it('should return an string', async () => {

            let result = helperPathTools.getDefaultsPath();
            expect(result.length).toBeGreaterThan(11);
        });
    });
});
