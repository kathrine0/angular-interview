import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

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
  @Input() rating: number = 0;

  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hoverRating: number = 0;

  onStarClick(star: number) {
    this.rating = star;
    this.ratingChange.emit(this.rating);
  }

  onStarHover(star: number) {
    this.hoverRating = star;
  }

  onStarLeave() {
    this.hoverRating = 0;
  }
}

