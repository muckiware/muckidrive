/**
 * @package     muckiDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

export class HelperDatabaseTools {

    public static getOperators(operator) {

        switch(operator) {

            case 'eq':
                return '=';
            case 'neq':
                return '<>';
            case 'like':
                return 'like';
            case 'nlike':
                return 'not like';
            case 'is':
                return 'is';
            case 'isn':
                return 'is not';
            case 'in':
                return 'in';
            case 'nin':
                return 'not in';
            case 'null':
                return 'null';
            case 'nnull':
                return 'not null';
            case 'gt':
                return '>';
            case 'lt':
                return '<';
            case 'gteq':
                return '>=';
            case 'lteq':
                return '<=';
            case 'from':
                return 'from';
            case 'to':
                return 'to';
            default:
                return '';
        }
    }
}
