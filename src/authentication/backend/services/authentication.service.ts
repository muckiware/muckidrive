/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Injectable } from '@nestjs/common';
// import { UsersService } from '@muckidrive/basics'
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../../../basics';

@Injectable()
export class AuthenticationService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {

        const user = await this.usersService.findUserByNameEmail(username);

        //Only for real users, not for system users
        if (user && !user.isSystemUser) {

            if(this._checkPass(pass, user.password)) {
                const { password, ...result } = user;
                return result;
            }
        }

        return null;
    }

    async createToken(username: string) {

        return {
            access_token: this.jwtService.sign({ username: username }),
        };
    }

    private _checkPass(passInput: string, dbHash: string): boolean {
	
		var check = bcrypt.compareSync(passInput, dbHash);
	
		if (check) {
			return true;
		}

        return false;
	}
}
