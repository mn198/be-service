import { Controller, Get } from '@nestjs/common';
import {
  HttpHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators';

@ApiTags('Health Check')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly mongo: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @Public()
  readiness() {
    return this.healthService.check([
      async () => this.http.pingCheck('google', 'https://google.com'),
      async () => this.mongo.pingCheck('mongodb'),
    ]);
  }
}
