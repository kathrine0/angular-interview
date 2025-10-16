# Bad Practices Implementation Guide

This document details all the intentional bad practices implemented in Exercise 1 for the Angular recruitment task.

## Overview

The exercise is a User Management Dashboard built with **Angular Material** that demonstrates common anti-patterns found in real-world Angular applications.

## Technologies Used

- Angular 20.x
- Angular Material 20.x
- RxJS 7.x
- TypeScript 5.x

## Bad Practices Implemented

### 1. ✅ Nested RxJS Subscriptions (Subscription Hell)

**Location**: `exercise1.ts` lines 50-78, 134-141, 150-152, 175-187, 198-213

**Examples**:

```typescript
// 3-4 levels of nested subscriptions in loadData()
this.exercise1Service.users$.subscribe((users) => {
  // Level 1
  this.exercise1Service.loadPostsForUser(users[0].id).subscribe((posts) => {
    // Level 2
    this.exercise1Service.loadCommentsForPost(posts[0].id).subscribe((comments) => {
      // Level 3
      this.exercise1Service.notifications$.subscribe((notification) => {
        // Level 4
      });
    });
  });
});
```

**Expected Fix**: Use RxJS operators like `switchMap`, `mergeMap`, `concatMap`, `forkJoin`, `combineLatest`

---

### 2. ✅ No ngOnDestroy Implementation

**Location**: `exercise1.ts` - Component class (line 40)

**Problem**:
- Multiple subscriptions created in constructor and methods
- No cleanup implemented
- Memory leaks will occur
- Subscriptions in `loadData()` and `setupNotifications()` never unsubscribed

**Expected Fix**:
- Implement `OnDestroy` interface
- Store subscriptions in a `Subscription` object
- Call `unsubscribe()` in `ngOnDestroy()`
- Or use `takeUntil()` with a Subject
- Or use `async` pipe instead

---

### 3. ✅ No Async Pipe Usage

**Location**: `exercise1.html` and `exercise1.ts`

**Problem**:
- All data manually subscribed in component (lines 50-78)
- Data stored in component properties
- Manual subscription management required
- No automatic unsubscription

**Expected Fix**:
- Expose Observables directly to template
- Use `| async` pipe in template
- Let Angular handle subscription lifecycle

---

### 4. ✅ Old Control Flow Syntax

**Location**: `exercise1.html` - Throughout

**Examples**:
- `*ngIf` (lines 13, 17, 45, etc.)
- `*ngFor` (lines 90, 117, 156)
- `*ngSwitch` / `*ngSwitchCase` (lines 99-107)

**Expected Fix**: Replace with new Angular control flow:
- `*ngIf` → `@if`
- `*ngFor` → `@for`
- `*ngSwitch` → `@switch`

---

### 5. ✅ Component with Multiple Responsibilities

**Location**: `exercise1.ts` - Entire component

**Problems**:

1. **Data Fetching** (lines 45-78):
   - Direct API calls from component
   - Loading state management

2. **Business Logic** (lines 89-126):
   - Filtering logic (`onSearchChange`, `applyStatusFilter`)
   - Sorting logic (`sortUsers`)
   - Search implementation

3. **Presentation Logic** (lines 220-226):
   - Derived state calculations (`getActiveUsersCount()`, `getTotalLikes()`)
   - Called in template (performance issue)

4. **State Management**:
   - 12+ public properties managing state
   - No clear data flow

**Expected Fix**:
- Extract business logic to service or facade
- Create separate presentational components
- Use smart/dumb component pattern
- Move calculations to `computed()` or pipes

---

### 6. ✅ SCSS Hardcoded Values vs Material Tokens

**Location**: `exercise1.scss` - Throughout

**Bad Examples** (Hardcoded):

```scss
// BAD: Hardcoded padding
padding: 20px;

// BAD: Hardcoded color
color: #1a237e;

// BAD: Hardcoded font-size
font-size: 28px;

// BAD: Hardcoded box-shadow
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

// BAD: Hardcoded border
border: 2px solid transparent;

// BAD: Using ::ng-deep
::ng-deep .mat-mdc-card {
  border-radius: 8px !important;
}
```

**Good Examples** (Should be used throughout):

```scss
// GOOD: Use Material spacing system
@use '@angular/material' as mat;

// Should use Material spacing: mat.get-spacing(2)
// Should use Material colors: mat.get-theme-color($theme, primary, 50)
// Should use Material typography: mat.typography-level($config, body-1)
// Should use Material elevation: mat.elevation(4)
```

**Expected Fix**:
- Create a proper Material theme
- Use Material design tokens throughout
- Use theming functions and mixins
- Remove all hardcoded values
- Remove `::ng-deep` hacks

---

### 7. ✅ Service Exposing Full Subject Interface

**Location**: `exercise1-service.ts` lines 33-36

**Bad Implementation**:

```typescript
// BAD: Public Subjects
public users$ = new Subject<User[]>();
public posts$ = new Subject<Post[]>();
public comments$ = new Subject<Comment[]>();
public notifications$ = new Subject<string>();
```

**Problem**:
- External code can call `.next()` directly
- Component directly calls: `this.exercise1Service.notifications$.next('...')`
- Breaks encapsulation
- No control over data flow

**Expected Fix**:

```typescript
// GOOD: Private Subject, public Observable
private usersSubject = new Subject<User[]>();
public users$ = this.usersSubject.asObservable();
```

---

## Additional Bad Practices

### 8. Constructor Doing Work

**Location**: `exercise1.ts` lines 39-42

```typescript
constructor() {
  this.loadData();        // BAD: Side effects in constructor
  this.setupNotifications(); // BAD: Subscriptions in constructor
}
```

**Expected Fix**: Move to `ngOnInit()`

---

### 9. Methods Called in Template

**Location**: `exercise1.html` lines 7-8

```html
<mat-chip class="stat-chip">Active: {{ getActiveUsersCount() }}</mat-chip>
<mat-chip class="stat-chip">Total Likes: {{ getTotalLikes() }}</mat-chip>
```

**Problem**: Methods called on every change detection cycle

**Expected Fix**: Use `computed()` signals or pipes

---

### 10. No Proper TypeScript Access Modifiers

**Location**: `exercise1.ts` lines 44-49

All properties are public by default, should use proper access modifiers (`private`, `protected`, `readonly`)

---

## Material Components Used

To maintain consistency with modern Angular practices, the exercise uses:

- `mat-card` - Card containers
- `mat-button` - Action buttons
- `mat-form-field` - Form inputs
- `mat-input` - Text inputs
- `mat-select` - Dropdown selects
- `mat-chip` - Status badges and stat displays
- `mat-icon` - Icons throughout
- `mat-spinner` - Loading indicator
- `mat-divider` - Section separators
- `mat-badge` - Like count badges

---

## Testing the Exercise

Run the application:

```bash
npm start
```

Navigate to the Exercise 1 route and verify:

1. ✅ Users list loads
2. ✅ Search and filtering work
3. ✅ Clicking user loads posts
4. ✅ Clicking post loads comments
5. ✅ Status editing works
6. ✅ Like button increments count
7. ✅ Delete button removes post
8. ✅ All Material components render properly

---

## Candidate Instructions

Candidates should refactor this code while:

1. Maintaining all existing functionality
2. Using Angular Material components (already implemented)
3. Following Material Design principles
4. Implementing proper theming
5. Fixing all 7+ bad practices
6. Following Angular style guide
7. Adding proper TypeScript types
8. Implementing proper error handling

The result should be production-ready code that follows all Angular and Material Design best practices.

