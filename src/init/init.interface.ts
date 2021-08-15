/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

export interface InitDefaultsLanguage {

    table: string,
    name: string,
    description: string,
    isActive: boolean,
    code: string,
    codeLong: string,
    codeLocale: string,
    codeCulture: string,
    Iso639xValue: string
}