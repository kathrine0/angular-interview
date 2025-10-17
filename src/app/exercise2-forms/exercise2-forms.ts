import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RatingInputComponent } from './rating-input.component';

@Component({
  selector: 'app-exercise2-forms',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    RatingInputComponent,
  ],
  templateUrl: './exercise2-forms.html',
  styleUrl: './exercise2-forms.scss',
})
export class Exercise2FormsComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);

  feedbackForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    rating: [0, [Validators.required, Validators.min(1)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  onSubmit() {
    if (this.feedbackForm.valid) {
      console.log('Form submitted:', this.feedbackForm.value);
      this.snackBar.open('Feedback submitted successfully!', 'Close', {
        duration: 3000,
      });
    } else {
      console.log('Form is invalid:', this.feedbackForm.value);
      console.log('Form errors:', this.getFormErrors());
      this.snackBar.open('Please fix the errors in the form', 'Close', {
        duration: 3000,
      });
    }
  }

  resetForm() {
    this.feedbackForm.reset();
    this.snackBar.open('Form reset', 'Close', { duration: 2000 });
  }

  fillSampleData() {
    this.feedbackForm.patchValue({
      name: 'John Doe',
      email: 'john.doe@example.com',
      rating: 4,
      message:
        'This is a sample feedback message with enough characters to meet the minimum requirement.',
    });
    this.snackBar.open('Sample data filled', 'Close', { duration: 2000 });
  }

  toggleFormState() {
    if (this.feedbackForm.enabled) {
      this.feedbackForm.disable();
      this.snackBar.open('Form disabled', 'Close', { duration: 2000 });
    } else {
      this.feedbackForm.enable();
      this.snackBar.open('Form enabled', 'Close', { duration: 2000 });
    }
  }

  getFormErrors() {
    const errors: any = {};
    Object.keys(this.feedbackForm.controls).forEach((key) => {
      const control = this.feedbackForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
