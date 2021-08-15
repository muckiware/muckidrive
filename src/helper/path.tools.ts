/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
const dotProp = require('dot-prop');
const writeFileAtomic = require('write-file-atomic');

@Injectable()
export class HelperPathTools {

	/**
	 * Path for configuration files, e.g. config.yml or schema.gql, etc.
	 */
	public readonly ETC_PATH = 'var/etc';

	/**
	 * Path for json default json files with database default contents
	 */
	public readonly DB_DEFAULTS_PATH = 'dist/var/db';

    public getModuleListPath(): string {

		return path.normalize(path.join(process.cwd(), this.ETC_PATH + '/module.json'));
	}

	public getDefaultsPath(): string {

		return path.normalize(path.join(process.cwd(), this.DB_DEFAULTS_PATH));
	}
}