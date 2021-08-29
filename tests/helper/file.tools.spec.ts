/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { TestVariables } from '../test.variables';
import { HelperFileTools } from '../../src/helper';

 describe('helperFileTools', () => {

    describe('saveObjectByNewFile() without input', () => {

        it('should return an error message', async () => {

            expect.assertions(2);

            try {
                HelperFileTools.saveObjectByNewFile('', {});
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty('message', 'Invalid input');
            }
        });
    });

    describe('saveObjectByNewFile()', () => {

        it('should return the object of file', async () => {

            try {

                HelperFileTools.saveObjectByNewFile(
                    TestVariables.testFilePath,
                    TestVariables.inputTestFileObject
                );
            } catch (error) {
                console.error(error);
            }

            expect(
                HelperFileTools.getObjectByFile(TestVariables.testFilePath)
            ).toMatchObject(TestVariables.inputTestFileObject);
        });
    });
});
