import { ApiProperty } from '@nestjs/swagger';
import { IResponse } from '../common/interfaces';

export class ClassResponse<T> implements IResponse<T> {
  @ApiProperty({
    default: 200,
  })
  status: number;

  @ApiProperty({
    default: 'Success',
  })
  message: string;

  @ApiProperty()
  datas: T;
}
