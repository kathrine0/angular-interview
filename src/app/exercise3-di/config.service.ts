import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly configSignal = signal<any>(null);

  // Public readonly signal for reactive access
  readonly config = computed(() => this.configSignal() ?? {});
  readonly isInitialized = computed(() => this.configSignal() !== null);

  async initialize(): Promise<void> {
    console.log('ConfigService: Loading base configuration...');
    this.configSignal.set({});

    await this.delay(1000);

    this.configSignal.set({
      apiUrl: 'https://api.example.com',
      apiTimeout: 5000,
      enableAnalytics: true,
      theme: 'light',
    });

    console.log('ConfigService: Configuration loaded');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

