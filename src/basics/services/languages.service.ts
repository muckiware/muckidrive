/**
 * @package     muckiwareDrive
 * @subpackage  Server
 *
 * @copyright Copyright (C) 2021 by smoppit. All rights reserved.
 * @license MIT
 * @link https://github.com/muckiware/muckidrive
 */

//Import Framework parts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';

//Import Smoppit sales parts
import { LanguagesModel, CreateLanguageDto } from '../models';

@Injectable()
export class LanguagesService {

    constructor(
        @InjectRepository(LanguagesModel)
        private readonly languagesRepository: Repository<LanguagesModel>
    ) {}

    public create(CreateLanguageDto: CreateLanguageDto): Promise<LanguagesModel> {

        const language = new LanguagesModel();
        language.name = CreateLanguageDto.name;
        language.description = CreateLanguageDto.description;
        language.isActive = CreateLanguageDto.isActive;
        language.isDefault = CreateLanguageDto.isDefault;
        language.code = CreateLanguageDto.code;
        language.codeLong = CreateLanguageDto.codeLong;
        language.codeLocale = CreateLanguageDto.codeLocale;
        language.codeCulture = CreateLanguageDto.codeCulture;
        language.Iso639xValue = CreateLanguageDto.Iso639xValue;
        language.createDateTime = new Date(DateTime.utc().toString());

        return this.languagesRepository.save(language);
    }

    public async findAll(orderField = 'id', sortDirection = 'ASC', skip = 0, take = 10): Promise<LanguagesModel[]> {
        return this.languagesRepository.find(
            { 
                skip: skip,
                take: take,
                order: {
                    [orderField]: sortDirection
                }
            }
        );
    }

    public async countAll(): Promise<number> {
        return this.languagesRepository.count();
    }

    public async findOne(id: number): Promise<LanguagesModel> {
        return this.languagesRepository.findOne(id);
    }

    /**
     * Search for language item by long language code string as input
     * 
     * @param codeLong string
     * @returns LanguagesModel
     */
     public findUserByCodelong(codeLong: string): Promise<LanguagesModel> {

        return this.languagesRepository.findOne({
            where:  {
                codeLong: codeLong
            }
        });
    }

    async remove(id: string): Promise<void> {

        // const category = await this.findOne(id);
        // await category.destroy();

        await this.languagesRepository.delete(id);
    }
}