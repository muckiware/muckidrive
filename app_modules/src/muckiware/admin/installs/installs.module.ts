/**
 * @package     muckiwareDrive
 * @subpackage  Server module
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Module, Global } from '@nestjs/common';
import { MuckiwareAdminInstallsResolver } from './index';

@Global()
@Module({
    imports: [],
    providers: [ 
        MuckiwareAdminInstallsResolver
    ],
    exports: []
})

export class MuckiwareAdminInstallsModule {

    public static moduleVersion = '1.0.0'
    public static vendor = 'muckiware'
    public static description = 'This module does managed the installed modules'
    public static license = 'MIT'
    public static depending = [ 'CoreModule' ]
}
