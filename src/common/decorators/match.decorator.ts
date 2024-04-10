import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function Match<T>(
  property: keyof T,
  validationOptions?: ValidationOptions,
) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedProportyName] = args.constraints;
          const relatedValue = (args.object as unknown)[relatedProportyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedProportyName] = args.constraints;
          return `${propertyName} must match ${relatedProportyName}`;
        },
      },
    });
  };
}

// https://stackoverflow.com/questions/71149373/object-parameter-in-class-validator-registerdecorator-function
