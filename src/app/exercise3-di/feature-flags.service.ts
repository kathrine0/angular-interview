import { computed, inject, Injectable, signal } from '@angular/core';
import { ConfigService } from './config.service';
import { UserPreferencesService } from './user-preferences.service';

// BAD: Depends on both ConfigService and UserPreferencesService
// but all three initialize in parallel
@Injectable({
  providedIn: 'root',
})
export class FeatureFlagsService {
  private readonly configService = inject(ConfigService);
  private readonly userPreferencesService = inject(UserPreferencesService);
  private readonly flagsSignal = signal<any>(null);

  // Public readonly signal for reactive access
  readonly flags = computed(() => this.flagsSignal() ?? {});
  readonly isInitialized = computed(() => this.flagsSignal() !== null);

  async initialize(): Promise<void> {
    console.log('FeatureFlagsService: Loading feature flags...');

    // BAD: Reading from both services immediately, might not be initialized!
    const config = this.configService.config();
    const preferences = this.userPreferencesService.preferences();

    const configReady = !!config.apiUrl;
    const preferencesReady = !!preferences.language;

    if (!configReady) {
      console.error('❌ FeatureFlagsService: ConfigService not ready! apiUrl is missing');
    }
    if (!preferencesReady) {
      console.error('❌ FeatureFlagsService: UserPreferencesService not ready! language is missing');
    }
    if (configReady && preferencesReady) {
      console.log('✅ FeatureFlagsService: Both dependencies are ready');
    }

    await this.delay(500);

    this.flagsSignal.set({
      enableNewDashboard: config.enableAnalytics && preferences.notifications,
      enableBetaFeatures: false,
      enableAdvancedCharts: true,
      maxWidgets: preferences.itemsPerPage ? preferences.itemsPerPage * 2 : 20,
    });

    console.log('FeatureFlagsService: Feature flags loaded');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

