import { BadRequestException, ValidationError } from '@nestjs/common';

import '../utils/extension/string.ext';

/**
 * Custom validation exception factory.
 *
 * This function will catch all validation errors and throw BadRequestException with the first error message
 *
 * @param errors
 */
export function validationExceptionFactory(errors: ValidationError[]) {
  const errorConstraints = errors
    .map((error) => {
      return Object.values(error.constraints ?? {}).map((message) =>
        message.capitalizeFirstWord(),
      );
    })
    .flat();

  throw new BadRequestException(errorConstraints);
}
