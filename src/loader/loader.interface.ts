/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { DynamicModule } from '@nestjs/common';

export interface SmoppitSalesModule {

    /**
     * Name of module
     */
    name: string;

    /**
     * Version of module, example 1.3.4
     */
    moduleVersion: string;

    /**
     * Name of the vendor of these module
     */
    vendor?: string;
    author?: string;

    /**
     * Description of the module
     */
    description?: string;

    /**
     * Licence of the module
     */
    license?: string;

    /**
     * Keywords which the module describs 
     */
    keywords?: string;

    /**
     * Url to the project of the module
     */
    homepage?: string;

    /**
     * Module reference
     */
    module: DynamicModule;

    /**
     * Depending modules which the current module needs
     */
    depending?: []
}