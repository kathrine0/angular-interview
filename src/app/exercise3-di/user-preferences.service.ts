import { computed, Injectable, inject, signal } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  private readonly configService = inject(ConfigService);
  private readonly preferencesSignal = signal<any>(null);

  readonly preferences = computed(() => this.preferencesSignal() ?? {});
  readonly isInitialized = computed(() => this.preferencesSignal() !== null);

  async initialize(): Promise<void> {
    console.log('UserPreferencesService: Loading user preferences...');
    this.preferencesSignal.set({});

    const config = this.configService.config();

    if (!config.apiUrl) {
      console.error('❌ UserPreferencesService: ConfigService not ready! apiUrl is missing');
    } else {
      console.log('✅ UserPreferencesService: ConfigService is ready');
    }

    await this.delay(800);

    this.preferencesSignal.set({
      language: 'en',
      notifications: true,
      dashboardLayout: 'grid',
      itemsPerPage: config.itemsPerPage || 10, // Will use fallback if config not ready
    });

    console.log('UserPreferencesService: Preferences loaded');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
