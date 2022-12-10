import { getSchemaPath } from '@nestjs/swagger';
import { ClassResponse } from './class-response';

export function generalSchema(Dto, type: 'object' | 'array') {
  let data: any = { type: type };
  switch (type) {
    case 'object':
      data = { ...data, $ref: getSchemaPath(Dto) };
      break;
    case 'array':
      data = { ...data, items: { $ref: getSchemaPath(Dto) } };
      break;
    default:
      break;
  }

  return {
    allOf: [
      { $ref: getSchemaPath(ClassResponse) },
      {
        properties: {
          datas: data,
        },
      },
    ],
  };
}
