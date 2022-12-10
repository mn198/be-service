import { IPaging } from './paging.interface';

export interface IResponse<T> {
  status: number;
  message: string;
  datas: T;
  pagination?: IPaging;
}
