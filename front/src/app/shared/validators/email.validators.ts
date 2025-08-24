import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function emailValidator(): ValidatorFn {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // Laisser le required gérer le champ vide
    return regex.test(value) ? null : { email: true };
  };
}
