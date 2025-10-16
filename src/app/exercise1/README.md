# Exercise 1: Code Refactoring Challenge (30 min)

## Objective

This exercise contains intentionally poor code that needs to be refactored following Angular best practices. Your task is to identify and fix all the issues while maintaining the same functionality.

Time estimate: **30 minutes**

## Current Functionality

The application is a User Management Dashboard that:

- Displays a list of users with their status (active/inactive/pending)
- Allows searching and filtering users by name, email, and status
- Allows sorting users by different criteria
- Shows posts for each selected user

## Issues to Fix

### 1. RxJS Subscription Management

- **Problem**: Multiple nested subscriptions creating "subscription hell"
- **Location**: `exercise1.ts` - `loadData()`, `selectUser()`
- **What to fix**: Flatten nested subscriptions using RxJS operators like `switchMap`, `mergeMap`

### 2. Memory Leaks

- **Problem**: No `ngOnDestroy` implementation to cleanup subscriptions
- **Location**: `exercise1.ts` - Component class
- **What to fix**: Implement `OnDestroy` and unsubscribe from all subscriptions

### 3. No Async Pipe Usage

- **Problem**: Manual subscription management instead of using async pipe
- **Location**: `exercise1.html` and `exercise1.ts`
- **What to fix**: Use async pipe in templates to automatically handle subscriptions

### 4. Old Control Flow Syntax

- **Problem**: Using deprecated `*ngIf`, `*ngFor`, `*ngSwitch` syntax
- **Location**: `exercise1.html` - Throughout the template
- **What to fix**: Replace with new control flow: `@if`, `@for`, `@switch`

### 5. Multiple Component Responsibilities

- **Problem**: Component handles data fetching, business logic, and presentation
- **Location**: `exercise1.ts` - Entire component
- **What to fix**:
  - Extract business logic to services
  - Separate smart (container) and presentational (dumb) components
  - Move filtering, sorting logic to service or separate utility

### 6. SCSS Hardcoded Values

- **Problem**: Mix of hardcoded values and Angular Material design tokens
- **Location**: `exercise1.scss` - Throughout the file
- **What to fix**:
  - Replace all hardcoded values (colors, spacing, font-sizes) with Material design tokens
  - Use Material theming system properly (`@use '@angular/material' as mat`)
  - Use Material spacing, typography, and color functions
  - Remove `::ng-deep` and use proper theming instead
  - Follow Material's elevation system instead of custom box-shadows

### 7. Service Exposing Subject

- **Problem**: Service exposes full Subject interface instead of Observable
- **Location**: `exercise1-service.ts` - Public properties
- **What to fix**:
  - Keep Subjects private
  - Expose only Observable interface using `.asObservable()`
  - Prevent external code from calling `.next()` on Subjects

## Bonus Improvements

Consider these additional improvements:

- Use `OnPush` change detection strategy
- Implement proper error handling
- Use `computed()` or pipes for derived values instead of methods in templates
- Implement proper TypeScript types and access modifiers
- Consider using Angular Signals for reactive state management
- Create a proper Material theme with custom colors

## Success Criteria

Your refactored code should:

1. Maintain all existing functionality
2. Fix all 7 issues listed above
3. Follow Angular best practices and style guide
4. Be clean, readable, and maintainable
5. Have no memory leaks
6. Use proper TypeScript typing

Good luck!
