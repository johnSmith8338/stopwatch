import { effect, inject, Injectable, signal } from '@angular/core';
import { ThemeRepository, ThemeTYpe } from '../core/repositories/theme.repository';

@Injectable({
  providedIn: 'root',
})
export class ThemeSvc {
  private readonly repository = inject(ThemeRepository);

  readonly theme = signal<ThemeTYpe>('light');

  constructor() {
    effect(() => {
      document.documentElement.setAttribute(
        'data-theme',
        this.theme()
      );
    })
  }

  async toggle() {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    await this.repository.save(next);
    this.theme.set(next);
  }

  async restore() {
    const theme = await this.repository.load();
    if (theme) this.theme.set(theme);
  }
}
