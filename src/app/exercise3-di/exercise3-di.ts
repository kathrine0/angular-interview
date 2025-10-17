import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ConfigService } from './config.service';
import { UserPreferencesService } from './user-preferences.service';
import { FeatureFlagsService } from './feature-flags.service';

@Component({
  selector: 'app-exercise3-di',
  imports: [JsonPipe, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './exercise3-di.html',
  styleUrl: './exercise3-di.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Exercise3DIComponent {
  private readonly configService = inject(ConfigService);
  private readonly userPreferencesService = inject(UserPreferencesService);
  private readonly featureFlagsService = inject(FeatureFlagsService);

  protected readonly config = this.configService.config;
  protected readonly preferences = this.userPreferencesService.preferences;
  protected readonly flags = this.featureFlagsService.flags;

  protected readonly configInitialized = this.configService.isInitialized;
  protected readonly preferencesInitialized = this.userPreferencesService.isInitialized;
  protected readonly flagsInitialized = this.featureFlagsService.isInitialized;

  protected readonly isAllInitialized = computed(() => {
    console.log(
      'isAllInitialized',
      this.configInitialized(),
      this.preferencesInitialized(),
      this.flagsInitialized()
    );
    return this.configInitialized() && this.preferencesInitialized() && this.flagsInitialized();
  });

  protected async refresh() {
    console.log('--- Refreshing data ---');
    // Intentionally calling in parallel (same problem as app initializer)
    await Promise.all([
      this.configService.initialize(),
      this.userPreferencesService.initialize(),
      this.featureFlagsService.initialize(),
    ]);
  }
}
