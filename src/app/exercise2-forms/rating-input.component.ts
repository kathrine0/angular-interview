import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

// BAD: This component does NOT implement ControlValueAccessor
// It uses @Input and @Output instead, which doesn't integrate with Angular Forms
@Component({
  selector: 'app-rating-input',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="rating-container">
      @for (star of stars; track star) {
        <mat-icon
          class="star"
          [class.filled]="star <= rating"
          (click)="onStarClick(star)"
          (mouseenter)="onStarHover(star)"
          (mouseleave)="onStarLeave()">
          {{ star <= (hoverRating || rating) ? 'star' : 'star_border' }}
        </mat-icon>
      }
      @if (rating > 0) {
        <span class="rating-text">{{ rating }} / 5</span>
      }
    </div>
  `,
  styles: [`
    .rating-container {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 0;
    }

    .star {
      cursor: pointer;
      user-select: none;
      transition: color 0.2s, transform 0.1s;
      color: #ffc107;

      &:hover {
        transform: scale(1.1);
      }

      &.filled {
        color: #ffc107;
      }
    }

    .rating-text {
      margin-left: 8px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
    }
  `],
})
export class RatingInputComponent {
  // BAD: Using @Input instead of implementing ControlValueAccessor
  @Input() rating: number = 0;

  // BAD: Using @Output instead of calling onChange callback from ControlValueAccessor
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hoverRating: number = 0;

  onStarClick(star: number) {
    this.rating = star;
    // BAD: Emitting through @Output won't update the form control
    this.ratingChange.emit(this.rating);
  }

  onStarHover(star: number) {
    this.hoverRating = star;
  }

  onStarLeave() {
    this.hoverRating = 0;
  }

  // MISSING: No implementation of ControlValueAccessor methods:
  // - writeValue(value: any): void
  // - registerOnChange(fn: any): void
  // - registerOnTouched(fn: any): void
  // - setDisabledState(isDisabled: boolean): void

  // MISSING: No NG_VALUE_ACCESSOR provider registration
}

