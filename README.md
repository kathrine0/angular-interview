# Angular Interview Exercises

A collection of Angular coding exercises designed to assess candidate skills in various areas of Angular development. Each exercise contains intentionally poor code that candidates need to identify and fix.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.6.

## Exercises

### Exercise 1: Code Refactoring (30 min)
**Path:** `/exercise1`
**Topics:** RxJS, Memory Management, Component Architecture, SCSS Best Practices

A user management dashboard with multiple Angular anti-patterns:
- Nested RxJS subscriptions (subscription hell)
- Memory leaks (no unsubscribe)
- Business logic in components
- Old control flow syntax (`*ngIf`, `*ngFor`)
- Hardcoded SCSS values instead of Material Design tokens
- Services exposing Subjects directly

**Files:**
- `/src/app/exercise1/` - All exercise files
- `README.md` - Exercise instructions
- `BAD_PRACTICES_GUIDE.md` - Detailed explanation of issues
- `IMPLEMENTATION_SUMMARY.md` - Complete solution guide

### Exercise 2: Forms & ControlValueAccessor (30 min)
**Path:** `/exercise2-forms`
**Topics:** Angular Forms, ControlValueAccessor, Custom Form Components

A feedback form with a custom rating component that doesn't properly integrate with Angular Forms:
- Custom rating component using `@Input/@Output` instead of `ControlValueAccessor`
- Form integration issues (value not syncing, validation not working)
- Disabled state not handled
- Programmatic form operations (reset, patchValue) not working

**Files:**
- `/src/app/exercise2-forms/` - All exercise files
- `README.md` - Exercise instructions
- `BAD_PRACTICES_GUIDE.md` - Detailed explanation of issues
- `IMPLEMENTATION_SUMMARY.md` - Complete solution with tests

## How to Use

### For Interviewers

1. Clone the repository
2. Run `npm install`
3. Run `ng serve`
4. Send the candidate the link to the exercise and README
5. Ask them to fix the issues in the specified time
6. Review their solution using the `IMPLEMENTATION_SUMMARY.md` as a reference

### For Candidates

1. Read the exercise README carefully
2. Identify all the issues in the code
3. Fix the issues while maintaining functionality
4. Test your solution thoroughly
5. Refer to the `BAD_PRACTICES_GUIDE.md` if you get stuck (optional)

## Quick Navigation

Once the app is running, use the navigation bar at the top to switch between exercises:
- **Exercise 1: Refactoring** - RxJS, architecture, and styling issues
- **Exercise 2: Forms** - ControlValueAccessor implementation

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
