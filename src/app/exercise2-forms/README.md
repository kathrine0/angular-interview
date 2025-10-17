# Exercise 2: Forms (30 min)

## Objective

This exercise contains a form with a custom form component that is not properly integrated with Angular's Forms API. Your task is to identify and fix the issues.

## Current Functionality

The application is a User Feedback Form that includes:

- Standard form fields (name, email, message)
- A custom star rating component (currently broken)
- Form validation
- Submit functionality

## The Problem

The form currently has a custom rating component:

**Custom Rating Component** (`app-rating-input`) - A star rating selector (1-5 stars)

This component is **not working correctly**

As a result:

- Its value is not properly bound to the form model
- Form validation doesn't work with this component
- It doesn't respond to programmatic value changes
- The form doesn't include its value when submitting
- Disabled state is not respected

## Bonus Improvements

Consider these additional improvements:

- Add custom validators for the rating component
- Implement proper accessibility (ARIA labels, keyboard navigation)
- Add validation error messages for the rating component
- Add proper TypeScript typing
