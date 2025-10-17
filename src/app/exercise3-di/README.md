# Exercise 3: Dependency Injection Initialization Order

The services in this exercise depend on each other for proper initialization.

## Instructions

Open `src/app/app.config.ts`, and **uncomment the three `provideAppInitializer` calls** that initialize:

- ConfigService
- UserPreferencesService
- FeatureFlagsService

Run the app and notice console errors. Think how you can fix the issue with the order of the initialization.
