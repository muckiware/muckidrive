/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import * as path from 'path';
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
    }
}