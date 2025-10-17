# Exercise 2: Forms (30 min)

## Objective

This exercise contains a form with a custom form component that is not working properly. Your task is to identify and fix the issues.

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
