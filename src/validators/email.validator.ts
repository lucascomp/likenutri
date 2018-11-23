import { FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';

import * as EmailValidator from 'email-validator';

export const emailValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const email = control.get('email');

  return EmailValidator.validate(email.value) ? null : { 'emailInvalid': true };
};