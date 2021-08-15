/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

//Import Framework parts
import { Injectable } from '@nestjs/common';

//Import Smoppit sales parts
import { HelperPathTools } from '../../helper/index'

@Injectable()
export class BasicsService {

    constructor(
        private helperPathTools: HelperPathTools
    ) {}

    public getModuleListPath(): string {

		return this.helperPathTools.getModuleListPath();
	}

    public getDefaultsPath(): string {

		return this.helperPathTools.getDefaultsPath();
	}
}