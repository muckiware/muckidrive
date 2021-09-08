 /**
 * @package     muckiDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ConfigService} from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';


import { AuthorizationBackendService, AuthorizationRolesGuard } from '../../../../src/authorization/backend';
import { UsersService, UsersModel } from '../../../../src/basics';


class ReflectorMock {
    get() {
        return '';
    }
}

class UsersServiceMock {
    findUserByNameEmail(userName) {
        return null;
    }
}

class AuthorizationBackendServiceMock {
    findOneByUserId(currentUserId) {
        return null;
    }
}

class ConfigServiceMock {
    get() {
        return '';
    }
}

 describe('AuthorizationRolesGuard', () => {
     
    let authorizationRolesGuard: AuthorizationRolesGuard;
 
    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [ 
                AuthorizationRolesGuard,
                Reflector,
                {
                    provide: UsersService,
                    useClass: UsersServiceMock,
                },
                {
                    provide: AuthorizationBackendService,
                    useClass: AuthorizationBackendServiceMock,
                },
                {
                    provide: ConfigService,
                    useClass: ConfigServiceMock,
                },

            ],
        }).compile();

        authorizationRolesGuard = moduleRef.get<AuthorizationRolesGuard>(AuthorizationRolesGuard);
    });
 
    describe('validateUser()', () => {

        it('checkup class', async () => {

            let result =  authorizationRolesGuard.checkUpClass();

            expect(result).toBeTruthy();

        });
    });

    //describe('Mocked Execution Context', () => {

        // it('should have a fully mocked Execution Context', async () => {

        //   const mockExecutionContext = createMock<ExecutionContext>({
        //     switchToHttp: () => ({
        //       getRequest: () => ({
        //         headers: {
        //             authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNjI5NjI0MzUxLCJleHAiOjE3MTYwMjQzNTF9.8rQDt5r9xIVK3hdfkKOn_lRncCGaKY0ryDywkTVVaDk',
        //         },
        //       }),
        //     }),
        //   });

        //   console.log('mockExecutionContext', mockExecutionContext);

        //   let result = await authorizationRolesGuard.canActivate(mockExecutionContext);

        //   console.log('result mockExecutionContext', result);
        //   mockExecutionContext
        //     .switchToHttp()
        //     .getResponse.mockReturnValue({ data: 'res return data' });
        //   expect(mockExecutionContext.switchToHttp().getRequest()).toEqual({
        //     headers: {
        //       authorization: 'auth',
        //     },
        //   });
        //   expect(mockExecutionContext.switchToHttp().getResponse()).toEqual({
        //     data: 'res return data',
        //   });
        //   expect(mockExecutionContext.switchToHttp).toBeCalledTimes(3);
        //   expect(mockExecutionContext.switchToWs().getClient()).toBeDefined();
     //   });
     // });
});
