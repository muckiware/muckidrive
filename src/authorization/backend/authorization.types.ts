/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

export enum AuthorizationBackendActions {

    manage = 'manage',
    create = 'create',
    read = 'read',
    update = 'update',
    delete = 'delete',
}

export class RoleMetadata{

    public static context = 'roleContext';
}