import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ConfigService } from './exercise3-di/config.service';
import { FeatureFlagsService } from './exercise3-di/feature-flags.service';
import { UserPreferencesService } from './exercise3-di/user-preferences.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    // UNCOMMENT THIS FOR EXERCISE 3

    // provideAppInitializer(() => {
    //   const configService = inject(ConfigService);
    //   return configService.initialize(); // Returns Observable
    // }),
    // provideAppInitializer(() => {
    //   const preferencesService = inject(UserPreferencesService);
    //   return preferencesService.initialize();
    // }),
    // provideAppInitializer(() => {
    //   const flagsService = inject(FeatureFlagsService);
    //   return flagsService.initialize();
    // }),
  ],
};
