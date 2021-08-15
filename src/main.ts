/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {

    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    await app.listen(configService.get<number>('http.port'));
}

bootstrap();
