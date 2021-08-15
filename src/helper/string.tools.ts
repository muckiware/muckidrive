/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

const bcrypt = require('bcrypt');

export class HelperStringTools {

    public static createHashPassword(password: string): string {
	
        var salt_rounds = 12;
        var salt = bcrypt.genSaltSync(salt_rounds);
    
        return bcrypt.hashSync(password, salt);
    }
}