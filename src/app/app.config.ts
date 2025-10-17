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
import { UserPreferencesService } from './exercise3-di/user-preferences.service';
import { FeatureFlagsService } from './exercise3-di/feature-flags.service';
import { combineLatest, switchMap } from 'rxjs';

// BAD: Multiple provideAppInitializer calls run in PARALLEL
// This causes race conditions because they depend on each other
// but execute simultaneously!
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    // GOOD:
    // provideAppInitializer(() => {
    //   const configService = inject(ConfigService);
    //   const preferencesService = inject(UserPreferencesService);
    //   const flagsService = inject(FeatureFlagsService);

    //   return (async () => {
    //     await configService.initialize();
    //     await preferencesService.initialize();
    //     await flagsService.initialize();
    //   })();
    // }),

    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      return configService.initialize(); // Returns Observable
    }),
    provideAppInitializer(() => {
      const preferencesService = inject(UserPreferencesService);
      return preferencesService.initialize(); // BAD: Needs ConfigService first!
    }),
    provideAppInitializer(() => {
      const flagsService = inject(FeatureFlagsService);
      return flagsService.initialize(); // BAD: Needs both previous services!
    }),
  ],
};
