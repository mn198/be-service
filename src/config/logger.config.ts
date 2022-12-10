import { Injectable } from '@nestjs/common';
import {
  utilities,
  WinstonModuleOptions,
  WinstonModuleOptionsFactory,
} from 'nest-winston';
import { format, transports } from 'winston';

import { LOG_LEVEL } from '../constants';

@Injectable()
export class WinstonLoggerConfigService implements WinstonModuleOptionsFactory {
  async createWinstonModuleOptions(): Promise<WinstonModuleOptions> {
    return {
      level: LOG_LEVEL.INFO,
      transports: [
        new transports.Console({
          format: format.combine(
            format.timestamp(),
            format.ms(),
            utilities.format.nestLike(process.env.APP_NAME || 'nest', {
              prettyPrint: true,
              colors: true,
            }),
          ),
        }),
      ],
    };
  }
}
