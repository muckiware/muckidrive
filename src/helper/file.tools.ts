/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
const dotProp = require('dot-prop');
const writeFileAtomic = require('write-file-atomic');

export class HelperFileTools {

    private static defaultPathMode = 0o0700;
    private static writeFileOptions = {mode: 0o0600};
    private static permissionError = 'No access to this file.';

    public static saveObjectByNewFile(file: string, inputList: {} = {}) {

		if(file === '') {
			throw new Error('Invalid input');
		}

		try {

			// Make sure the folder exists as it could have been deleted in the meantime
			mkdirp.sync(path.dirname(file), this.defaultPathMode);
			writeFileAtomic.sync(file, JSON.stringify(inputList, null, '\t'), this.writeFileOptions);
		} catch (err) {

			// Improve the message of permission errors
			if (err.code === 'EACCES') {
				err.message = `${err.message}\n${this.permissionError}\n`;
			}

			throw err;
		}
    }

	public static saveObjectInFile(file: string, inputList: {}) {

		const existingFileObject = HelperFileTools.getObjectByFile(file);
		existingFileObject.push(inputList);

        try {

			// Make sure the folder exists as it could have been deleted in the meantime
			mkdirp.sync(path.dirname(file), this.defaultPathMode);
			writeFileAtomic.sync(file, JSON.stringify(existingFileObject, null, '\t'), this.writeFileOptions);
		} catch (err) {

			// Improve the message of permission errors
			if (err.code === 'EACCES') {
				err.message = `${err.message}\n${this.permissionError}\n`;
			}

			throw err;
		}
    }

	public static saveKeyValueInFile(file: string, key: string, value: string | number| boolean | []) {

		const fileObject = HelperFileTools.getObjectByFile(file);

		if (arguments.length === 1) {
			for (const k of Object.keys(key)) {
				dotProp.set(fileObject, k, key[k]);
			}
		} else {
			dotProp.set(fileObject, key, value);
		}
	}

	/**
	 * Method for to create an object of a file content
	 * 
	 * @param file 
	 * @returns Object
	 */
	public static getObjectByFile(file: string) {

		if(file === '') {
			throw new Error('Invalid input');
		}

		try {
			return JSON.parse(fs.readFileSync(file, 'utf8'));
		} catch (err) {

			// Create dir if it doesn't exist
			if (err.code === 'ENOENT') {
				mkdirp.sync(path.dirname(file), this.defaultPathMode);
			}

			// Improve the message of permission errors
			if (err.code === 'EACCES') {
				err.message = `${err.message}\n${this.permissionError}\n`;
				throw new Error(err)
			}

			// Empty the file if it encounters invalid JSON
			if (err.name === 'SyntaxError') {
				writeFileAtomic.sync(file, '', this.writeFileOptions);
			}
		}
	}

	public static findFilesByExtension(base: string, ext: string, files?: string[], result?: string[]): any[] {

        files = files || fs.readdirSync(base);
        result = result || [];
  
        files.forEach((file) => {

            const newbase = path.join(base, file);
            if (fs.statSync(newbase).isDirectory()) {
                result = this.findFilesByExtension(newbase, ext, fs.readdirSync(newbase), result);
            } else {
                if (file.substr(-1 * (ext.length + 1)) === '.' + ext) {
                    if (result) {
                        result.push(newbase);
                    }
                }
            }
        });

        return result;
    }
}