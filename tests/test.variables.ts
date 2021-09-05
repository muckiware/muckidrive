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
}