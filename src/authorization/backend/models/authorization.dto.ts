/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';

export class AuthorizationDto {

    username: string;

    password: string;

    rememberMe: boolean;
}
