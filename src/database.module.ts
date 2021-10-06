/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

import { Module, DynamicModule, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService} from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                name: 'default',
                type: configService.get<any>('db.type'),
                host: configService.get<string>('db.host'),
                port: +configService.get<number>('db.port'),
                username: configService.get<string>('db.username'),
                password: configService.get<string>('db.password'),
                database: configService.get<string>('db.database'),
                autoLoadEntities: true,
                synchronize: true,
                keepConnectionAlive: true,
                entityPrefix: configService.get<string>('db.entityPrefix'),
                logging: configService.get<boolean>('db.logging')
            })
        })
    ],
})
export class DatabaseModule {

    public static async registerDatabaseModuleAsync(): Promise<DynamicModule> {

        Logger.log('Loading database module', 'LoadDatabaseModule');
        return {
            module: DatabaseModule,
        } as DynamicModule;
    }
}
