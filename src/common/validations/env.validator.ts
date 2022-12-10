import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsSemVer,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'Development',
  CI = 'CI',
  UAT = 'UAT',
  Staging = 'Staging',
  Production = 'Production',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsSemVer()
  APP_VERSION: string;

  @IsString()
  APP_NAME: string;
}

export function envValidator(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
