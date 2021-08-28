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

import { LoggerModule, LoggerServiceInterface } from '../index';
import { ModuleConfigService } from '../../config';

import { HelperFileTools } from '@muckidrive/helper';
@Injectable()
export class LoggerService implements LoggerServiceInterface {

    CONFIG_PATH: string = '/var/etc';

    private _logger: log4js.Logger;

    constructor(
        private readonly moduleConfigService: ModuleConfigService
    ) { }

    async trace(message: string, loggerContext = '', extensionContext = ''): Promise<void> {

        if(await this.getModuleConfigValueByKey('enable')) {
            if(this._setLoggerConfig(loggerContext, extensionContext)) {
                this._logger.info(message);
            }
        }
    }

    async debug(message: string, loggerContext = '', extensionContext = ''): Promise<void> {

        if(await this.getModuleConfigValueByKey('enable')) {
            if(this._setLoggerConfig(loggerContext, extensionContext)) {

                console.log('log message', message);
                this._logger.debug(message);
            }
        }
    }

    async info(message: string, loggerContext = '', extensionContext = ''): Promise<void>{

        if(await this.getModuleConfigValueByKey('enable')) {
            if(this._setLoggerConfig(loggerContext, extensionContext)) {
                this._logger.info(message);
            }
        }
    }

    async warn(message: string, loggerContext = '', extensionContext = ''): Promise<void> {

        if(await this.getModuleConfigValueByKey('enable')) {
            if(this._setLoggerConfig(loggerContext, extensionContext)) {
                this._logger.warn(message);
            }
        }
    }

    async error(message: string, loggerContext = '', extensionContext = ''): Promise<void> {

        if(await this.getModuleConfigValueByKey('enable')) {
            if(this._setLoggerConfig(loggerContext, extensionContext)) {
                this._logger.error(message);
            }
        }
    }

    async fatal(message: string, loggerContext = '', extensionContext = ''): Promise<void> {

        if(await this.getModuleConfigValueByKey('enable')) {
            if(this._setLoggerConfig(loggerContext, extensionContext)) {
                this._logger.fatal(message);
            }
        }
    }

    public getModuleConfigValueByKey(key: string, defaultValue: any = null) {
        return this.moduleConfigService.getValueByKey(LoggerModule.name, key, defaultValue);
    }

    protected async _setLoggerConfig(loggerContext: string, extensionContext: string): Promise<boolean> {

        let configFilePath: string = this._getConfigPath(loggerContext, extensionContext);

        if(this._checkConfigPath(configFilePath, loggerContext, extensionContext)) {

            log4js.configure(configFilePath);
            this._logger = log4js.getLogger(loggerContext + extensionContext);
        }

        return false;
    }

    protected _getConfigPath(loggerContext: string = '', extensionContext: string = ''): string {

        let logPath: string = path.resolve() + this.CONFIG_PATH;

        switch (true) {
            case (loggerContext !== '' && extensionContext !== ''):
                return logPath + '/logconfig.' + extensionContext + '.' + loggerContext + '.json';
            case (loggerContext !== '' && extensionContext == ''):
                return logPath + '/logconfig.' + loggerContext + '.json';
            case (loggerContext == '' && extensionContext !== ''):
                return logPath + '/logconfig.' + extensionContext + '.json';
            default:
                return logPath + '/logconfig.json';
        }
    }

    protected _getLoggerFileName(loggerContext = '', extensionContext = ''): string {
        
        let logPath = path.resolve() + '/var/log';
        switch (true) {
            case (loggerContext !== '' && extensionContext !== ''):
                return logPath + '/' + extensionContext + '.' + loggerContext + '.log';
            case (loggerContext !== '' && extensionContext == ''):
                return logPath + '/muckidrive.' + loggerContext + '.log';
            case (loggerContext == '' && extensionContext !== ''):
                return logPath + '/' + extensionContext + '.log';
            default:
                return logPath + '/muckidrive.log';
        }
    }

    protected _checkConfigPath(configFilePath: string, loggerContext: string = '', extensionContext: string = ''): boolean {

        if(this._checkConfigFile(configFilePath, loggerContext, extensionContext)) {
            return true;
        }

        return false;
    }

    protected _checkConfigFile($path: string, $loggerContext: string = '', $extensionContext: string = '') {
        
        if(fs.existsSync($path)) {
            return true;
        } else {

            this._createConfigJson($path, $loggerContext, $extensionContext);
            
            if(fs.existsSync($path)) {
                return true;
            } else {
                return false;
            }
        }
    }

    protected async _createConfigJson(path: string, loggerContext: string, extensionContext: string) {

        HelperFileTools.saveObjectByNewFile(
            path,
            {
                "appenders": {
                    out: {
                        type: "stdout",
                        layout: { 
                            type: 'basic'
                        }
                    },
                    [loggerContext + extensionContext]: {
                        type: "file",
                        layout: {
                            type: 'pattern',
                            pattern: '%d level: %p, message: %m'
                        },
                        filename: this._getLoggerFileName(loggerContext, extensionContext),
                        backups: await this.getModuleConfigValueByKey('max_files', 5),
                        maxLogSize: await this.getModuleConfigValueByKey('max_size', 5) * 1024 * 1024
                    }
                },
                categories: {
                    default: {
                        appenders: [
                            "out",
                            loggerContext + extensionContext
                        ],
                        level: await this.getModuleConfigValueByKey('loglevel', 'info'),
                        enableCallStack: true
                    }
                }
            }
        );
    }
}
