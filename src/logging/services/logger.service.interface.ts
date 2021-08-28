/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by muckiware. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

export interface LoggerServiceInterface {
    
    trace(message: string, loggerContext?: string, extensionContext?: string): Promise<void>;

    debug(message: string, loggerContext?: string, extensionContext?: string): Promise<void>;

    info(message: string, loggerContext?: string, extensionContext?: string): Promise<void>;

    warn(message: string, loggerContext?: string, extensionContext?: string): Promise<void>;

    error(message: string, loggerContext?: string, extensionContext?: string): Promise<void>;

    fatal(message: string, loggerContext?: string, extensionContext?: string): Promise<void>;

}