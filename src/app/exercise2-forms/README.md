# Exercise 2: Forms and ControlValueAccessor (30 min)

## Objective

This exercise contains a form with a custom form component that is not properly integrated with Angular's Forms API. Your task is to identify and fix the issues by implementing the ControlValueAccessor interface correctly.

Time estimate: **30 minutes**

## Current Functionality

The application is a User Feedback Form that includes:

- Standard form fields (name, email, message)
- A custom star rating component (currently broken)
- Form validation
- Submit functionality

## The Problem

The form currently has a custom rating component:

**Custom Rating Component** (`app-rating-input`) - A star rating selector (1-5 stars)

This component is **not working correctly** because it doesn't implement the `ControlValueAccessor` interface. As a result:

- Its value is not properly bound to the form model
- Form validation doesn't work with this component
- It doesn't respond to programmatic value changes
- The form doesn't include its value when submitting
- Disabled state is not respected

## Issues to Fix

### 1. Rating Component Not Implementing ControlValueAccessor

**Problem**: The `RatingInputComponent` doesn't implement `ControlValueAccessor`

**Location**: `rating-input.component.ts`

**Current Issues**:
- Using `@Input()` and `@Output()` instead of ControlValueAccessor
- No integration with Angular Forms
- Cannot be used with `formControlName` or `ngModel` properly
- No validation support
- Doesn't respond to programmatic value changes (e.g., `patchValue`, `setValue`)
- Disabled state not handled

**What to fix**:
- Implement the `ControlValueAccessor` interface
- Implement all four required methods:
  - `writeValue(value: any): void`
  - `registerOnChange(fn: any): void`
  - `registerOnTouched(fn: any): void`
  - `setDisabledState(isDisabled: boolean): void`
- Register the component as a `NG_VALUE_ACCESSOR` provider
- Remove `@Input()` and `@Output()` bindings for the value
- Properly handle touched state

### 2. Form Not Working with Custom Component

**Problem**: The main form cannot properly interact with the custom component

**Location**: `exercise2-forms.ts`

**Current Issues**:
- Form value doesn't include custom component value
- Form validation doesn't work with custom component
- Programmatic form operations (reset, patchValue) don't work

**What to fix**:
- Once the custom component implements ControlValueAccessor, the form should work properly
- Test that `formControl.setValue()` works
- Test that `form.reset()` works
- Test that validation works

## Success Criteria

Your refactored code should:

1. **Custom component implements ControlValueAccessor correctly**
   - All four methods implemented
   - Proper provider registration
   - No more `@Input()`/`@Output()` for value binding

2. **Form integration works perfectly**
   - Form value includes custom component value
   - Form validation works with custom component
   - Programmatic value changes work (patchValue, setValue, reset)
   - Disabled state is respected

3. **Proper state management**
   - Touched state is tracked correctly
   - Dirty state works
   - Valid/invalid states work with validators

4. **Test the following scenarios**:
   - Submit the form and see all values (including rating)
   - Reset the form and see all fields clear (including rating component)
   - Use the "Fill Sample Data" button and see rating component update
   - Disable the form and see rating component become disabled

## Bonus Improvements

Consider these additional improvements:

- Add custom validators for the rating component
- Implement proper accessibility (ARIA labels, keyboard navigation)
- Add validation error messages for the rating component
- Implement OnPush change detection strategy
- Add proper TypeScript typing
- Consider using Angular Signals for internal state

## Learning Resources

- [Angular ControlValueAccessor Guide](https://angular.io/api/forms/ControlValueAccessor)
- [Creating Custom Form Controls](https://angular.io/guide/forms-overview#creating-custom-form-controls)

## Tips

1. The `NG_VALUE_ACCESSOR` provider should be registered in the component's providers array
2. `onChange` and `onTouched` callbacks must be called to notify the form
3. `writeValue` is called when the form value changes programmatically
4. Always handle `null` values in `writeValue`
5. Call `onTouched()` when the component loses focus

Good luck!
