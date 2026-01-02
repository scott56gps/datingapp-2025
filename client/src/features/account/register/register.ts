import { Component, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RegisterCredentials } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { TextInput } from '../../../shared/text-input/text-input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  cancelRegister = output<boolean>();
  protected credentials = {} as RegisterCredentials;
  protected credentialsForm: FormGroup;
  protected profileForm: FormGroup;
  protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);
  private email = '';
  private displayName = '';
  private password = '';
  private confirmPassword = '';

  constructor() {
    this.credentialsForm = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.required]],
      displayName: [this.displayName, Validators.required],
      password: [
        this.password,
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ],
      confirmPassword: [
        this.confirmPassword,
        [Validators.required, this.matchFormValues('password')],
      ],
    });
    this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
    });

    this.profileForm = this.formBuilder.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  /**
   * Calculates the date 18 years before today.
   */
  calculateMaxDateAllowed(): Date {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date;
  }

  matchFormValues(controlNameToMatch: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent; // We need access to the 'other' form group to compare
      if (!parent) return null;
      const matchValue = parent.get(controlNameToMatch)?.value;
      return control.value === matchValue ? null : { isMismatched: true };
    };
  }

  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update((prevStep) => prevStep + 1);
    }
  }

  prevStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update((prevStep) => prevStep - 1);
    }
  }

  register() {
    if (this.profileForm.valid && this.credentialsForm.valid) {
      const formData = { ...this.credentialsForm.value, ...this.profileForm.value };

      this.accountService.register(formData).subscribe({
        next: () => {
          this.router.navigateByUrl('/members');
        },
        error: (error) => {
          console.log(error);
          this.validationErrors.set(error);
        },
      });
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
