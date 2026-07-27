import { computed, effect, inject, Injectable } from '@angular/core';
import { SettingsSvc } from './settings-svc';
import { AppTheme } from '../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeSvc {
  private readonly settings = inject(SettingsSvc);

  readonly theme = this.settings.theme;

  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.theme());
    })
  }

  toggle() {
    return this.settings.toggleTheme();
  }

  set(theme: AppTheme) {
    return this.settings.setTheme(theme);
  }
}
