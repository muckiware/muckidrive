/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Test } from '@nestjs/testing';
import * as path from 'path';

import { LoggerService } from '../../src/logging';
import { ModuleConfigService } from '../../src/config';

import { TestVariables } from '../test.variables';

class ModuleConfigServiceMock {

    getValueByKey(moduleName: string, key: string, defaultValue: any = null) {

        return defaultValue;
    }
}

describe('LoggerService', () => {
    
    let loggerService: LoggerService;

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [ 
                LoggerService,
                {
                    provide: ModuleConfigService,
                    useClass: ModuleConfigServiceMock,
                }
            ],
        }).compile();

        loggerService = moduleRef.get<LoggerService>(LoggerService);
    });

    describe('getConfigPath()', () => {

        it('should return an complete config path string', async () => {

            expect(
                loggerService.getConfigPath(TestVariables.inputLoggerContext, TestVariables.inputExtensionContext)
            ).toBe(path.resolve() + loggerService.CONFIG_PATH + '/logconfig.extensionContext.' + TestVariables.inputLoggerContext + '.json');
        });

        it('should return an config path string only loggerContext', async () => {

            expect(
                loggerService.getConfigPath(TestVariables.inputLoggerContext)
            ).toBe(path.resolve() + loggerService.CONFIG_PATH + '/logconfig.' + TestVariables.inputLoggerContext + '.json');
        });

        it('should return an config path string without params', async () => {

            expect(
                loggerService.getConfigPath()
            ).toBe(path.resolve() + loggerService.CONFIG_PATH + '/logconfig.json');
        });
    });

    describe('getLoggerFileName()', () => {

        it('should return an complete log path string', async () => {

            expect(
                loggerService.getLoggerFileName(TestVariables.inputLoggerContext, 'extensionContext')
            ).toBe(
                path.resolve() + loggerService.LOG_PATH + '/' + TestVariables.inputExtensionContext + '.' + TestVariables.inputLoggerContext + '.log'
            );
        });

        it('should return an log path string only loggerContext', async () => {

            expect(
                loggerService.getLoggerFileName(TestVariables.inputLoggerContext)
            ).toBe(path.resolve() + loggerService.LOG_PATH + '/muckidrive.' + TestVariables.inputLoggerContext + '.log');
        });

        it('should return an log path string without params', async () => {

            expect(
                loggerService.getLoggerFileName()
            ).toBe(path.resolve() + loggerService.LOG_PATH + '/muckidrive.log');
        });
    });

    describe('createConfigObject()', () => {

        it('should creates an logger config object', async () => {

            let configObject = await loggerService.createConfigObject(
                TestVariables.inputLoggerContext,
                TestVariables.inputExtensionContext
            );

            expect(
                JSON.stringify(configObject)
            ).toBe(
                JSON.stringify(TestVariables.logConfigObject)
            );
        });

    });
});