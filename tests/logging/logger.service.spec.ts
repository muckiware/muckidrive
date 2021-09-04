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

class ModuleConfigServiceMock {

    getValueByKey(moduleName: string, key: string, defaultValue: any = null) {
        return {};
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

    describe('_getConfigPath()', () => {

        it('should return an complete log path string', async () => {

            expect(
                loggerService.getConfigPath('loggerContext', 'extensionContext')
            ).toBe(path.resolve() + loggerService.CONFIG_PATH + '/logconfig.extensionContext.loggerContext.json');
        });

        it('should return an log path string only loggerContext', async () => {

            expect(
                loggerService.getConfigPath('loggerContext')
            ).toBe(path.resolve() + loggerService.CONFIG_PATH + '/logconfig.loggerContext.json');
        });

        it('should return an log path string without params', async () => {

            expect(
                loggerService.getConfigPath()
            ).toBe(path.resolve() + loggerService.CONFIG_PATH + '/logconfig.json');
        });
    });
});