import { inject, Injectable, signal } from '@angular/core';
import { StorageSvc } from './storage-svc';

export type ThemeTYpe = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeSvc {
  readonly storage = inject(StorageSvc);

  readonly theme = signal<ThemeTYpe>('light');

  constructor() {
    this.setTheme(this.storage.getTheme());
  }

  setTheme(theme: ThemeTYpe) {
    this.theme.set(theme);
    document.documentElement.dataset['theme'] = theme;
    this.storage.saveTheme(theme);
  }

  toggle() {
    this.setTheme(this.theme() === 'light' ? 'dark' : 'light');
  }
}
