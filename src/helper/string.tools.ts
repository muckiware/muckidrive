/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

 import * as bcrypt from 'bcrypt';

export class HelperStringTools {

    public static readonly  saltRounds = 12;

    public static createHashPassword(password: string): string {

        if(password !== '') {
            var salt = bcrypt.genSaltSync(this.saltRounds);
            return bcrypt.hashSync(password, salt);
        }
	
        throw new Error('Invalid input');
    }
}
