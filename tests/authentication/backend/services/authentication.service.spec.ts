/**
 * @package     muckiDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
 
import { AuthenticationService } from '../../../../src/authentication/backend';
import { UsersService, UsersModel, LanguagesModel } from '../../../../src/basics';
import { TestVariables } from '../../../test.variables';
 
class UsersServiceMock {
 
    findUserByNameEmail(username: string):UsersModel  {
        return TestVariables.testUser;
    }
}

class JwtServiceMock {
 
    sign(username) {

        return {};
    }
}
 
describe('AuthenticationService', () => {
     
    let authenticationService: AuthenticationService;
 
    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [ 
                AuthenticationService,
                {
                    provide: UsersService,
                    useClass: UsersServiceMock,
                },
                {
                    provide: JwtService,
                    useClass: JwtServiceMock,
                }
            ],
        }).compile();

        authenticationService = moduleRef.get<AuthenticationService>(AuthenticationService);
    });
 
    describe('validateUser()', () => {

        it('Password wrong, should return null', async () => {

            let validateUser = await authenticationService.validateUser(
                TestVariables.testUser.eMail,
                TestVariables.testUserPassword + '123'
            );

            expect(validateUser).toBeNull();

        });

        it('should return an complete user object', async () => {

            let validateUser = await authenticationService.validateUser(
                TestVariables.testUser.eMail,
                TestVariables.testUserPassword
            );

            expect(validateUser).toBeTruthy();

        });

        it('should return an error message, of invalid password input', async () => {

            expect.assertions(2);

            try {
                await authenticationService.validateUser(
                    TestVariables.testUser.eMail,
                    ''
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty('message', 'Invalid input');
            }
        });

        it('should return an error message, of invalid user input', async () => {

            expect.assertions(2);

            try {
                await authenticationService.validateUser(
                    '',
                    TestVariables.testUserPassword
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty('message', 'Invalid input');
            }
        });
    });
});
