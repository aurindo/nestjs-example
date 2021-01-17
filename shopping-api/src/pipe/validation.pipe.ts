import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
        const messages: string[][] = errors.map(error => this.extractMessages(error))
      throw new BadRequestException(messages);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private extractMessages(validationError: ValidationError): string[] {
    const constraintsKeys: string[] = Object.keys(validationError.constraints);
    const messages: string[] =
        constraintsKeys.map(constraintKey => validationError.constraints[constraintKey]);
    return messages;
  }
}
