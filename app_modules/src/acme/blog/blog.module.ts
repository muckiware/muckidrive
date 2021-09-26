/**
 * @package     blog example
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by acme. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Module, Global } from '@nestjs/common';
import { BlogResolver } from './blog.resolver';

@Global()
@Module({
    imports: [],
    providers: [ BlogResolver ],
    exports: []
})

export class AcmeBlogModule {

    public static moduleVersion = '1.0.0'
    public static vendor = 'ACME'
    public static description = 'This module does managed blog items'
    public static license = 'MIT'
    public static depending = [ 'CoreModule' ]
}
