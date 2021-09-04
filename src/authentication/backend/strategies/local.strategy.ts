/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthenticationService } from '@muckidrive/authentication/backend';
import { AuthenticationService } from '../services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthenticationService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {

        const user = await this.authService.validateUser(username, password);

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
