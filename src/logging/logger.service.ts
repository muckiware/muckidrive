/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Injectable, Logger } from '@nestjs/common';

import * as log4js from 'log4js'
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService {

    CONFIG_PATH: string = '/var/etc/log.conf.json';
    private _logger: log4js.Logger;

    constructor() {

        if(this._logger !== undefined) {

            let logPath: string = path.resolve() + this.CONFIG_PATH;
            Logger.debug('logPath: is ' + logPath, 'logger');
            Logger.debug('set logger config', 'logger');
            try {
                fs.mkdirSync('./var/log');
            } catch (e) {
                if (e.code != 'EEXIST') {
                    Logger.error('Could not set up log directory, error was', 'logger');
                    Logger.error(e, 'logger');
                    process.exit(1);
                }
            }

            try {
                JSON.parse(
                    this.getTextFileContent(
                      logPath.replace(/\//g, "\\")
                    )
                );
            } catch (e) {
                Logger.error(logPath.replace(/\//g, "\\"), 'is not a valid json file!', 'logger');
                Logger.error(e, 'logger');
                process.exit(1);
            }

            log4js.configure(logPath);
            this._logger = log4js.getLogger();
        }
    }

    private getTextFileContent(file: string): string {

        try {  
            var data = fs.readFileSync(file, 'utf8');
            return data.toString();
        } catch(e) {
            console.log('Error read text file:', file);
            console.log(e.stack);
            return '';
        }
    }

    trace(message: string): void {
        this._logger.trace(message);
    }

    debug(message: string): void {
        this._logger.debug(message);
    }

    info(message: string): void {
        this._logger.info(message);
    }

    warn(message: string): void {
        this._logger.warn(message);
    }

    error(message: string): void {
        this._logger.error(message);
    }

    fatal(message: string): void {
        this._logger.fatal(message);
    }
}
