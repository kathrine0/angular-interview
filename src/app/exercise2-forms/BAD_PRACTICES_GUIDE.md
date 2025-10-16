# Exercise 2: Bad Practices Guide

This document explains all the intentional mistakes in this exercise and why they're problematic.

## Overview

This exercise demonstrates what happens when a custom form component doesn't properly integrate with Angular's Forms API through the `ControlValueAccessor` interface.

---

## Bad Practice #1: Using @Input/@Output Instead of ControlValueAccessor

### Location
- `rating-input.component.ts` - Lines 60, 63

### The Problem

```typescript
// BAD ❌
@Input() rating: number = 0;
@Output() ratingChange = new EventEmitter<number>();
```

### Why It's Bad

1. **No Angular Forms Integration**
   - Component cannot be used with `formControlName` properly
   - Form doesn't track the component's value
   - Validation doesn't work
   - Form state (touched, dirty, pristine) doesn't sync

2. **Manual Two-Way Binding Required**
   - Must use `[(rating)]` syntax which is fragile
   - Doesn't work with reactive forms `formControlName`
   - Parent component must manually manage the value

3. **No Programmatic Control**
   - `form.patchValue()` won't update the component
   - `form.reset()` won't clear the component
   - `formControl.setValue()` won't work

4. **No Disabled State Handling**
   - `form.disable()` won't disable the component
   - Component remains interactive even when form is disabled

### The Correct Way

```typescript
// GOOD ✅
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rating-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingInputComponent),
      multi: true
    }
  ]
})
export class RatingInputComponent implements ControlValueAccessor {
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};
  
  rating: number = 0;
  disabled: boolean = false;

  writeValue(value: number): void {
    this.rating = value || 0;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onStarClick(star: number) {
    if (!this.disabled) {
      this.rating = star;
      this.onChange(this.rating);  // Notify Angular Forms
      this.onTouched();            // Mark as touched
    }
  }
}
```

---

## Bad Practice #2: No NG_VALUE_ACCESSOR Provider

### Location
- `rating-input.component.ts` - Missing provider

### The Problem

Without the `NG_VALUE_ACCESSOR` provider registration, Angular doesn't know that your component can be used as a form control.

### Why It's Bad

1. **Angular Can't Find the Component**
   - Angular Forms won't recognize the component as a valid form control
   - `formControlName` directive won't work properly
   - No integration with form validation

2. **No Value Synchronization**
   - Changes in the component won't update the form
   - Changes in the form won't update the component

### The Correct Way

```typescript
// GOOD ✅
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-rating-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingInputComponent),
      multi: true
    }
  ]
})
```

**Key Points:**
- `provide: NG_VALUE_ACCESSOR` - The DI token
- `useExisting` - Use the current component instance
- `forwardRef()` - Required because we reference the class before it's defined
- `multi: true` - Multiple providers can exist for this token

---

## Bad Practice #3: Not Handling writeValue Properly

### Location
- Missing `writeValue` implementation

### The Problem

The `writeValue` method is how Angular tells your component what value it should display. Without it:

- Form's `patchValue()` won't work
- Form's `setValue()` won't work
- Form's `reset()` won't work
- Initial values won't be set

### The Correct Way

```typescript
// GOOD ✅
writeValue(value: number): void {
  // IMPORTANT: Handle null/undefined values
  this.rating = value ?? 0;
  
  // If you need to trigger change detection:
  this.cdr.markForCheck(); // Only needed with OnPush
}
```

**Important Considerations:**

1. **Handle null/undefined**
   ```typescript
   // When form resets, value might be null
   writeValue(value: number | null): void {
     this.rating = value ?? 0; // Use nullish coalescing
   }
   ```

2. **Don't Call onChange**
   ```typescript
   // BAD ❌
   writeValue(value: number): void {
     this.rating = value;
     this.onChange(value); // Creates infinite loop!
   }
   ```

3. **Trigger Change Detection if Needed**
   ```typescript
   // With OnPush strategy
   writeValue(value: number): void {
     this.rating = value ?? 0;
     this.cdr.markForCheck();
   }
   ```

---

## Bad Practice #4: Not Calling onChange Callback

### Location
- `rating-input.component.ts` - Line 71 (emits instead of calling onChange)

### The Problem

```typescript
// BAD ❌
onStarClick(star: number) {
  this.rating = star;
  this.ratingChange.emit(this.rating); // Angular Forms doesn't know about this!
}
```

The `onChange` callback is registered by Angular Forms through `registerOnChange`. You MUST call it to notify Angular that the value has changed.

### Why It's Bad

1. **Form Value Not Updated**
   - Form model won't reflect the new value
   - `form.value` won't include your component's value

2. **Validation Doesn't Run**
   - Form validators won't be triggered
   - Form validity state won't update

3. **Form State Not Updated**
   - `dirty` flag won't be set
   - Change events won't fire

### The Correct Way

```typescript
// GOOD ✅
private onChange: (value: number) => void = () => {};

registerOnChange(fn: any): void {
  this.onChange = fn;
}

onStarClick(star: number) {
  if (!this.disabled) {
    this.rating = star;
    this.onChange(this.rating); // Notify Angular Forms!
  }
}
```

---

## Bad Practice #5: Not Calling onTouched Callback

### Location
- Missing `onTouched` calls

### The Problem

The `onTouched` callback notifies Angular that the user has interacted with the control. Without it:

- `touched` state won't be set
- `pristine` state won't change to `dirty`
- Validation errors won't show at the right time

### Why It's Bad

1. **Touch State Not Tracked**
   ```typescript
   // User clicks on component
   // form.get('rating').touched === false ❌
   ```

2. **Validation UX Issues**
   - Can't show errors only after user interaction
   - Can't implement "show errors on blur" pattern

3. **Form State Incorrect**
   - Form's `touched` property doesn't update
   - Can't use `formControl.touched` for conditional rendering

### The Correct Way

```typescript
// GOOD ✅
private onTouched: () => void = () => {};

registerOnTouched(fn: any): void {
  this.onTouched = fn;
}

// Call it when user interacts
onStarClick(star: number) {
  this.rating = star;
  this.onChange(this.rating);
  this.onTouched(); // Mark as touched!
}

// Or on blur
@HostListener('blur')
onBlur() {
  this.onTouched();
}
```

---

## Bad Practice #6: Not Implementing setDisabledState

### Location
- Missing `setDisabledState` implementation

### The Problem

When the form or form control is disabled, your component should also become disabled. Without `setDisabledState`:

```typescript
// In parent component
this.form.disable(); // Custom component still works! ❌
```

### Why It's Bad

1. **User Can Still Interact**
   - Component remains clickable when form is disabled
   - Violates form's disabled state

2. **Inconsistent UI**
   - Other form fields are disabled, but custom component isn't
   - Confusing user experience

3. **Validation Issues**
   - Disabled controls should be excluded from validation
   - But component is still interactive

### The Correct Way

```typescript
// GOOD ✅
disabled: boolean = false;

setDisabledState(isDisabled: boolean): void {
  this.disabled = isDisabled;
}

// In template
<mat-icon 
  [class.disabled]="disabled"
  (click)="disabled ? null : onStarClick(star)">
</mat-icon>

// Or prevent interaction
onStarClick(star: number) {
  if (this.disabled) return; // Guard clause
  
  this.rating = star;
  this.onChange(this.rating);
  this.onTouched();
}
```

---

## Real-World Impact

### Without ControlValueAccessor

```typescript
// Parent component must manually manage everything
export class ParentComponent {
  rating: number = 0;
  
  onRatingChange(value: number) {
    this.rating = value;
    // Manual validation
    // Manual form state management
    // Manual dirty tracking
  }
  
  onSubmit() {
    // Must manually collect values
    const formData = {
      name: this.form.get('name').value,
      email: this.form.get('email').value,
      rating: this.rating, // Separate variable!
    };
  }
}

// Template
<app-rating-input 
  [rating]="rating" 
  (ratingChange)="onRatingChange($event)">
</app-rating-input>
```

### With ControlValueAccessor

```typescript
// Parent component: clean and simple
export class ParentComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.email],
    rating: [0, Validators.required], // Just works!
  });
  
  onSubmit() {
    // All values included automatically
    console.log(this.form.value);
  }
}

// Template
<app-rating-input formControlName="rating"></app-rating-input>
```

---

## Testing Implications

### Without ControlValueAccessor

```typescript
// Difficult to test
it('should update rating', () => {
  component.rating = 3;
  component.ratingChange.subscribe(value => {
    expect(value).toBe(3);
  });
  // Doesn't test form integration
});
```

### With ControlValueAccessor

```typescript
// Easy to test
it('should integrate with forms', () => {
  const control = new FormControl(3);
  component.writeValue(3);
  expect(component.rating).toBe(3);
  
  component.onStarClick(5);
  expect(control.value).toBe(5); // Form is updated
});
```

---

## Summary

| Issue | Impact | Fix |
|-------|--------|-----|
| Using @Input/@Output | No form integration | Implement ControlValueAccessor |
| Missing NG_VALUE_ACCESSOR | Angular can't recognize component | Add provider |
| Missing writeValue | Form can't set value | Implement writeValue |
| Not calling onChange | Form doesn't receive updates | Call onChange callback |
| Not calling onTouched | Touch state not tracked | Call onTouched callback |
| Missing setDisabledState | Component stays enabled | Implement setDisabledState |

---

## Resources

- [Angular ControlValueAccessor API](https://angular.io/api/forms/ControlValueAccessor)
- [Custom Form Controls Guide](https://angular.io/guide/forms-overview#creating-custom-form-controls)
- [Reactive Forms](https://angular.io/guide/reactive-forms)
