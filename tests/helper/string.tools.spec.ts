/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { TestVariables } from '../test.variables';
import * as bcrypt from 'bcrypt';

import { HelperStringTools } from '../../src/helper';

describe('helperStringTools', () => {
  
    describe('createHashPassword()', () => {

        it('should return a string as hash value', async () => {

            expect.stringContaining(
                HelperStringTools.createHashPassword(TestVariables.testPasswordInput)
            );
        });

        it('should return a valid hash value', async () => {

            const passwordHash =  HelperStringTools.createHashPassword(TestVariables.testPasswordInput);
            expect(
                bcrypt.compareSync(TestVariables.testPasswordInput, passwordHash)
            ).toBe(true);
        });

        it('should return an error message', async () => {

            expect.assertions(2);

            try {
                HelperStringTools.createHashPassword('');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty('message', 'Invalid input');
            }
        });
    });
});