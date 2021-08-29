export interface ModuleConfigServiceInterface {

    getValueByKey(moduleName: string, key: string, defaultValue?: any): Promise<any>;

    setValueByKey(key: string, value: any);

    getTypedValue(value: any, type: string);
}