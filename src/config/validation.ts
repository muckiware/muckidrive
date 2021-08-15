/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, validateSync } from 'class-validator';

enum Environment {
    Development = "development",
    Production = "production",
    Test = "test",
    Provision = "provision",
}

class EnvironmentVariables {

    @IsNumber()
    PORT: number;
}

export function validate(config: Record<string, unknown>) {

    console.log('validate config:', config);

    const validatedConfig = plainToClass(
        EnvironmentVariables,
        config,
        { enableImplicitConversion: true },
    );

    console.log('validatedConfig:', validatedConfig);
    
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
  
    return validatedConfig;
}
