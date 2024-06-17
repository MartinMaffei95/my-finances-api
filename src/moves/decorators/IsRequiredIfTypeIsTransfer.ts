import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsRequiredIfTypeIsTransfer(property: string, value: any, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRequiredIfTypeIsTransfer',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property, value],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName, relatedValue] = args.constraints;
          const relatedValueInObject = (args.object as any)[relatedPropertyName];
          if (relatedValueInObject === relatedValue) {
            return value !== null && value !== undefined;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName, relatedValue] = args.constraints;
          return `${propertyName} must be provided when ${relatedPropertyName} is ${relatedValue}`;
        }
      },
    });
  };
}
