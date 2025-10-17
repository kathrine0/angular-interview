import { computed, Injectable, inject, signal } from '@angular/core';
import { ConfigService } from './config.service';

// BAD: Service depends on ConfigService but no guarantee it's initialized first
@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  private readonly configService = inject(ConfigService);
  private readonly preferencesSignal = signal<any>(null);

  // Public readonly signal for reactive access
  readonly preferences = computed(() => this.preferencesSignal() ?? {});
  readonly isInitialized = computed(() => this.preferencesSignal() !== null);

  async initialize(): Promise<void> {
    console.log('UserPreferencesService: Loading user preferences...');

    // BAD: Reading config immediately, might not be initialized!
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
