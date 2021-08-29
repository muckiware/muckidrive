/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import * as bcrypt from 'bcrypt';

import { HelperStringTools } from '../../src/helper';

describe('helperStringTools', () => {
  
    describe('getHashPasswordString', () => {

        const testInput = '123456789ABC'

        it('should return a string as hash value', async () => {

            const passwordHash =  HelperStringTools.createHashPassword(testInput);
            expect.stringContaining(passwordHash);
        });

        it('should return a valid hash value', async () => {

            const passwordHash =  HelperStringTools.createHashPassword(testInput);
            const resultCheck = bcrypt.compareSync(testInput, passwordHash);
            expect(resultCheck).toBe(true);
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