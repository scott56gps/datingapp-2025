import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.css',
})
export class TextInput implements ControlValueAccessor {
  label = input<string>('');
  type = input<string>('text');
  maxDate = input<string>('');

  // @Self() tells angular to not search up the parent hierarchy for another control
  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  /**
   * Helper method to get a typed instance of the underlying FormControl.
   */
  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
}
