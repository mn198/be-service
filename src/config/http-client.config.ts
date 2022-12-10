import { Injectable } from '@nestjs/common';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { API_TIMEOUT } from '../constants';
import { stringify } from 'qs';

@Injectable()
export class HttpClientConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      headers: { 'Content-type': 'application/json' },
      timeout: API_TIMEOUT,
      // paramsSerializer: function (params) {
      //   return stringify(params, { arrayFormat: 'brackets' });
      // },
    };
  }
}
