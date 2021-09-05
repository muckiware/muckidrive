/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import * as path from 'path';
import { HelperStringTools } from '../src/helper';
export class TestVariables {

    public static defaultPathMode = 0o0700;
    public static writeFileOptions = {mode: 0o0600};
    public static permissionError = 'No access to this file.';
    public static testPasswordInput = '123456789ABC'
    public static testFilePath = 'tests/var/test.json';
    public static inputTestFileObject = {
        test: 123,
        test2: 'test-string'
    }
    public static inputExtensionContext = 'extensionContext';
    public static inputLoggerContext = 'loggerContext';
    public static logConfigObject = {
        "appenders": {
            out: {
                type: "stdout",
                layout: { 
                    type: 'basic'
                }
            },
            [TestVariables.inputLoggerContext + TestVariables.inputExtensionContext]: {
                type: "file",
                layout: {
                    type: 'pattern',
                    pattern: '%d level: %p, message: %m'
                },
                filename: path.resolve() + "/var/log/" + TestVariables.inputExtensionContext + "." + TestVariables.inputLoggerContext + ".log",
                backups: 5,
                maxLogSize: 5242880
            }
        },
        categories: {
            default: {
                appenders: [
                    "out",
                    TestVariables.inputLoggerContext + TestVariables.inputExtensionContext
                ],
                level: "info",
                enableCallStack: true
            }
        }
    };
    public static testUserPassword = '%password123'
    public static testUser = {
        id: 123,
        createDateTime: new Date('0000-00-00 00:00:00'),
        version: 1,
        uuid: 'abc-123',
        name: 'Fritz',
        eMail: 'email@example.com',
        userName: 'Max',
        firstName: 'Max',
        lastName: 'Mustermann',
        password: HelperStringTools.createHashPassword(TestVariables.testUserPassword),
        isActive: true,
        isSystemUser: false,
        isAdminUser: true,
        languageId: 0,
        defaultLanguage: {
            id: 123,
            createDateTime: new Date('0000-00-00 00:00:00'),
            version: 1,
            name: 'string',
            description: 'string',
            isActive: true,
            isDefault: true,
            code: 'string',
            codeLong: 'string',
            codeLocale: 'string',
            codeCulture: 'string',
            Iso639xValue: 'string',
        }
    }
}